// Creates a new instance of Express router
const router = require("express").Router({ mergeParams: true });
const controller = require("./pastes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// route() allows you to write the path once, and then chain multiple route handlers to that path
// get() can be post() or all()
// uses list() route handler in controller for get request to /
router
    .route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);
router
    .route("/:pasteId")
    .get(controller.read)
    .put(controller.update)
    .delete(controller.delete)
    .all(methodNotAllowed);

module.exports = router;