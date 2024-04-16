const express = require("express");
const app = express();
const pastesRouter = require("./pastes/pastes.router");
const usersRouter = require("./users/users.router");

/* built-in middleware function in Express that takes raw JSON data in request body
 + converts it into JS object accessible through req.body */
app.use(express.json());
app.use("/pastes", pastesRouter);
app.use("/users", usersRouter);

// Not found handler
app.use((req, res, next) => {
// Status code 404 is for not found
  res.status(404).json({ error: `Not found: ${req.originalUrl}` });
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  const {
    status = error.status || 500,
    message = error.message || "Something went wrong!"
  } = error;
  res.status(status).json({ error: message });
});

module.exports = app;
