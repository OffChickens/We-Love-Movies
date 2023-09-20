const router = require("express").Router({  mergeParams: true });
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/asyncErrorBoundary")

router.route("/:movieId/theaters").get(controller.read).all(methodNotAllowed);

router.route("/:movieId/reviews").get(controller.read).all(methodNotAllowed)

router.route("/:movieId([0-9]+)").get(controller.read).all(methodNotAllowed)

router.route("/").get(controller.list).all(methodNotAllowed);

module.exports = router;