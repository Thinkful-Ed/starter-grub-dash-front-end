const router = require("express").Router();
const ordersController = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// Route to handle orders list
router
  .route("/")
  .post(ordersController.create)
  .get(ordersController.list)
  .all(methodNotAllowed);

// Route to handle individual order
router
  .route("/:orderId")
  .get(ordersController.read)
  .put(ordersController.update)
  .delete(ordersController.delete)
  .all(methodNotAllowed);

module.exports = router;
