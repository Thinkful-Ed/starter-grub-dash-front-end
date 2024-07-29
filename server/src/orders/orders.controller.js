const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assign IDs when necessary
const nextId = require("../utils/nextId");

/* 

Orders Validations

*/

function orderExists(req, res, next) {
  const orderId = String(req.params.orderId);
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }
  next({
    status: 404,
    message: `Order does not exist: ${orderId}`,
  });
}

function orderIdPropertyIsValid(req, res, next) {
  const orderId = req.params.orderId;
  const { data: { id } = {} } = req.body;
  if (id === orderId || !id) {
    return next();
  }
  next({
    status: 400,
    message: `Order id does not match route id. Dish: ${id}, Route: ${orderId}`,
  });
}

function bodyDataIsDefined(req, res, next) {
  const { data } = req.body;
  if (data !== null && data !== undefined) {
    return next();
  }
  next({
    status: 400,
    message: "Request body must include 'data'.",
  });
}

function bodyDataHasProperty(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName] && data[propertyName].toString().trim() !== "") {
      return next();
    }
    next({ status: 400, message: `Order must include a '${propertyName}'` });
  };
}

function dishesPropertyIsValid(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  if (Array.isArray(dishes) && dishes.length > 0) {
    return next();
  }
  next({
    status: 400,
    message: "Property 'dishes' must be an array containing 1 or more dishes.",
  });
}

/*
A dish quantity property is missing	dish ${index} must have a quantity that is an integer greater than 0
A dish quantity property is zero or less	dish ${index} must have a quantity that is an integer greater than 0
A dish quantity property is not an integer	dish ${index} must have a quantity that is an integer greater than 0
*/
function allDishQuantitiesAreValid(req, res, next) {
  const { data: { dishes } = {} } = req.body;

  for (let index = 0; index < dishes.length; index++) {
    const quantity = dishes[index].quantity;
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0. Received: ${quantity}`,
      });
    }
  }
  next();
}

function statusPropertyIsValid(req, res, next) {
  const { data: { status } = {} } = req.body;
  const validStatus = ["pending", "preparing", "out-for-delivery", "delivered"];
  if (validStatus.includes(status)) {
    return next();
  }
  next({
    status: 400,
    message: `Value of the 'status' property must be one of ${validStatus}. Received: ${status}.`,
  });
}

function orderCanBeUpdated(req, res, next) {
  const { data: { status } = {} } = req.body;
  if (status !== "delivered") {
    return next();
  }
  next({
    status: 400,
    message: "A delivered order cannot be updated.",
  });
}

function orderCanBeDeleted(req, res, next) {
  const { status } = res.locals.order; // Get status from the found order

  if (status === "pending") {
    return next();
  }

  next({
    status: 400,
    message: `An order cannot be deleted unless it is 'pending'. Received: status=${status}`,
  });
}

/*

Order functions

*/

function list(req, res) {
  res.json({ data: orders });
}

function create(req, res) {
  const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;
  console.log(req.body); // Log the entire body to debug
  const newOrder = {
    id: nextId(), // Utility to create next unique order id
    deliverTo,
    mobileNumber,
    status: "pending", // Default status for a new order
    dishes,
  };

  orders.push(newOrder);

  res.status(201).json({ data: newOrder });
}

function read(req, res) {
  res.json({ data: res.locals.order });
}

function update(req, res) {
  const order = res.locals.order;
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

  // Update the order
  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;

  res.json({ data: order });
}

function destroy(req, res) {
  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === orderId);
  const deletedOrders = orders.splice(index, 1);
  console.log(deletedOrders);
  res.sendStatus(204);
}

module.exports = {
  create: [
    bodyDataIsDefined,
    bodyDataHasProperty("deliverTo"),
    bodyDataHasProperty("mobileNumber"),
    bodyDataHasProperty("dishes"),
    dishesPropertyIsValid,
    allDishQuantitiesAreValid,
    create,
  ],
  list,
  read: [orderExists, read],
  update: [
    orderExists,
    orderIdPropertyIsValid,
    bodyDataHasProperty("deliverTo"),
    bodyDataHasProperty("mobileNumber"),
    bodyDataHasProperty("status"),
    bodyDataHasProperty("dishes"),
    statusPropertyIsValid,
    orderCanBeUpdated,
    dishesPropertyIsValid,
    allDishQuantitiesAreValid,
    update,
  ],
  delete: [orderExists, orderCanBeDeleted, destroy],
  orderExists,
};
