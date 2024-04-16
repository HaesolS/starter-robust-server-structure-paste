const pastes = require("../data/pastes-data");

function list(req, res) {
    const { userId } = req.params;
    res.json({ data: pastes.filter(userId ? paste => paste.user_id == userId : () => true) });
// or res.json({ data: pastes });
}

// var to hold the next ID that finds the largest assigned ID value in pastes array
let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);
// or simply just put "id: pastes.length + 1"

function bodyDataHas(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if (data[propertyName]) {
            return next();
        }
        next({ status: 400, message: `Must include a ${propertyName}` });
    };
}

/* OR function hasHref(req, res, next) {
    const { data: { href } = {} } = req.body;
    if (href) {
      return next();
    }
    next({ 
      status: 400,
      message: "Must 'href' property is required"
    });
} */

function create(req, res) {
    // Extracts properties from data object; empty object = default value to prevent errors if data is missing
    const { data: { name, syntax, exposure, expiration, text, user_id } = {} } = req.body;
    // Increments last ID, then assigns as current ID
    const newPaste = { id: ++lastPasteId, name, syntax, exposure, expiration, text, user_id };
    pastes.push(newPaste);
    // Returns status code 201 when paste is successfully created
    res.status(201).json({ data: newPaste });
}

function exposurePropertyIsValid(req, res, next) {
    const { data: { exposure } = {} } = req.body;
    const validExposure = ["private", "public"];
    if (validExposure.includes(exposure)) {
        return next();
    }
    next({
        status: 400,
        message: `Value of the 'exposure' property must be one of ${validExposure}. Received: ${exposure}`
    });
}

function syntaxPropertyIsValid(req, res, next) {
    const { data: { syntax } = {} } = req.body;
    const validSyntax = ["None", "Javascript", "Python", "Ruby", "Perl", "C", "Scheme"];
    if (validSyntax.includes(syntax)) {
      return next();
    }
    next({
      status: 400,
      message: `Value of the 'syntax' property must be one of ${validSyntax}. Received: ${syntax}`
    });
  }

  function expirationIsValidNumber(req, res, next){
    const { data: { expiration }  = {} } = req.body;
    if (expiration <= 0 || !Number.isInteger(expiration)){
        return next({
            status: 400,
            message: `Expiration requires a valid number`
        });
    }
    next();
  }

function pasteExists(req, res, next) {
    const { pasteId } = req.params;
    // or req.params.pasteId
    const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
    if (foundPaste) {
        res.locals.paste = foundPaste;
        return next();
    }
    next({
        status: 404,
        message: `Paste id not found: ${pasteId}`
  });
}

function read(req, res) {
    res.json({ data: res.locals.paste });
}

function update(req, res) {
    const paste = res.locals.paste;
    const { data: { name, syntax, expiration, exposure, text } = {} } = req.body;
// Update the paste
    paste.name = name;
    paste.syntax = syntax;
    paste.expiration = expiration;
    paste.exposure = exposure;
    paste.text = text;
    res.json({ data: paste });
}

// Cannot be named delete b/c delete is a reserved word in JS
function destroy(req, res) {
    const { pasteId } = req.params;
    const index = pastes.findIndex((paste) => paste.id === Number(pasteId));
// Returns an array of the deleted elements, even if it is 1 element
    if (index > -1) {
        pastes.splice(index, 1);
    }
    res.sendStatus(204);
}

module.exports = {
    create: [
        bodyDataHas("name"),
        bodyDataHas("syntax"),
        bodyDataHas("exposure"),
        bodyDataHas("expiration"),
        bodyDataHas("text"),
        bodyDataHas("user_id"),
        exposurePropertyIsValid,
        syntaxPropertyIsValid,
        expirationIsValidNumber,
        create
    ],
    list,
    read: [
        pasteExists,
        read
    ],
    update: [
        pasteExists,
        bodyDataHas("name"),
        bodyDataHas("syntax"),
        bodyDataHas("exposure"),
        bodyDataHas("expiration"),
        bodyDataHas("text"),
        exposurePropertyIsValid,
        syntaxPropertyIsValid,
        expirationIsValidNumber,
        update
    ],
    delete: [
        pasteExists,
        destroy
    ]
};