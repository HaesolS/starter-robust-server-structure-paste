// Loads SuperTest library, pastes data, and Express server
const request = require("supertest");
const pastes = require("../src/data/pastes-data");
const app = require("../src/app");

// Groups together all tests related to /pastes path
describe("path /pastes", () => {
// Resets/clears pastes data prior to running each test
    beforeEach(() => {
        pastes.splice(0, pastes.length);
    })

    describe("GET method", () => {
        it("returns an array of pastes", async () => {
// expected array is defined w/ list of paste objects
            const expected = [
                {
                    id: 1,
                    user_id: 1,
                    name: "Hello",
                    syntax: "None",
                    expiration: 10,
                    exposure: "private",
                    text: "Hello World!"
                },
                {
                    id: 2,
                    user_id: 1,
                    name: "Hello World in Python",
                    syntax: "Python",
                    expiration: 24,
                    exposure: "public",
                    text: "print(Hello World!)"
                },
                {
                    id: 3,
                    user_id: 2,
                    name: "String Reverse in JavaScript",
                    syntax: "Javascript",
                    expiration: 24,
                    exposure: "public",
                    text: "const stringReverse = str => str.split('').reverse().join('');"
                }
            ];
// copies of expected paste objects are added to pastes array
            pastes.push(...expected);
// test sends API request to endpoint + response is stored in var
            const response = await request(app).get("/pastes");
// ensures response status code + response body match
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(expected);
        });
    });

    describe("POST method", () => {
// Ensures that API endpoint can successfully create new paste record
        it("creates a new paste and assigns id", async () => {
            const newPaste = {
                name: "String Reverse in Javascript",
                syntax: "Javascript",
                expiration: 24,
                exposure: "public",
                text: "const stringReverse = str => str.split('').reverse().join('');"
            };
            const expectedId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0) + 1;
            const response = await request(app)
                .post("/pastes")
// sets Accept header of request to "application/json"
                .set("Accept", "application/json")
                .send({ data: newPaste });
            expect(response.status).toBe(201);
            expect(response.body.data).toEqual({
                id: expectedId,
                ...newPaste,
            });
        });
// ensures that API endpoint returns 400 status code if request contains incorrectly formatted data
        it("returns 400 if name is missing", async () => {
            const response = await request(app)
                .post("/pastes")
                .set("Accept", "application/json")
                .send({ data: {
                    syntax: "Javascript",
                    expiration: 24,
                    exposure: "public",
                    text: "const stringReverse = str => str.split('').reverse().join('');"
                }});
            expect(response.status).toBe(400);
        });
// ensures that API endpoint returns 400 status code if request contains incorrectly formatted data
        it("returns 400 if name is empty", async () => {
            const response = await request(app)
                .post("/pastes")
                .set("Accept", "application/json")
                .send({ data: {
                    name: "",
                    syntax: "Javascript",
                    expiration: 24,
                    exposure: "public",
                    text: "const stringReverse = str => str.split('').reverse().join('');"
                }});
            expect(response.status).toBe(400);
        });
    });
});