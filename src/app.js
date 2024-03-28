const express = require("express");
const app = express();
const pastes = require("./data/pastes-data");

/* built-in middleware function in Express that takes raw JSON data in request body
 + converts it into JS object accessible through req.body */
app.use(express.json());

// Use app.get b/c you're fetching data for a specific paste
app.get("/pastes/:pasteId", (req, res, next) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
  if (foundPaste) {
    res.json({ data: foundPaste });
  } else {
    next({ status: 404, message: `Paste id not found: ${pasteId}` });
// OR res.status(404).json({ error: Past id not found: `${pastId}` });
  }
});

app.get("/pastes", (req, res) => {
  res.json({ data: pastes });
});

function bodyHasTextAndNameProperty(req, res, next) {
  const { data: { text, name } = {} } = req.body;
  if (text && name) {
// Calls next w/o error msg if result exists
    return next();
  }
  next({
    status: 400,
    message: "A 'text' or 'name' property is required."
  });
/* OR res.status(400).json({ error: "message" }); */
}
// Add text&name validation middleware function
app.post("/pastes", bodyHasTextAndNameProperty, (req, res) => {
// Extracts properties from data object; empty object = default value to prevent errors if data is missing
  const { data: { name, syntax, exposure, expiration, text, user_id } = {} } = req.body;
// var to hold the next ID that finds the largest assigned ID value in pastes array
  let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);
  // Increments last ID, then assigns as current ID
  const newPaste = { id: ++lastPasteId, name, syntax, exposure, expiration, text, user_id };
  pastes.push(newPaste);
// Returns status code 201 when paste is successfully created
  res.status(201).json({ data: newPaste });
});

// Not found handler
app.use((req, res, next) => {
// Status code 404 is for not found
  res.status(404).json({ error: `Not found: ${request.originalUrl}` });
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  res.status(status).json({ error: message });
});

module.exports = app;
