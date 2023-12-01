const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));
const dishes = require(path.resolve("src/data/dishes-data"));

const ORDER_STATUSES = ['pending', 'preparing', 'out-for-delivery', 'delivered'];

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");
const validate = require("../utils/validators");

const executeValidation = (validationResult, res) => {
  if (validationResult !== true) {
    return res.status(validationResult.status)
        .json({error: validationResult.message});
  }
}

// TODO: Implement the /orders handlers needed to make the tests pass

//create
function create(req, res, next) {

  executeValidation(
      validate.orderStrings(req.body.data.deliverTo, "deliverTo"), res);
  executeValidation(
      validate.orderStrings(req.body.data.mobileNumber, "mobileNumber"), res);

  const dishesFromPost = req.body.data.dishes;
  if (!dishesFromPost || !Array.isArray(dishesFromPost) || dishesFromPost.length === 0){
    return res.status(400).json({error: `Order must include a dish`})
  }

  let brokenDish = dishesFromPost.find((dish) => !dish.quantity || typeof dish.quantity !== "number");
  if ( brokenDish !== undefined) {
    return res.status(400).json({error: `Dish ${brokenDish.id} must have a quantity that is an integer greater than 0`})
  }

  const newOrder = {
    id: nextId(),
    deliverTo: req.body.data.deliverTo,
    mobileNumber: req.body.data.mobileNumber,
    status: 'pending',
    dishes: [
      {
        id: req.body.data.dishes[0].id || undefined,
        name: req.body.data.dishes[0].name || undefined,
        description: req.body.data.dishes[0].description || undefined,
        image_url: req.body.data.dishes[0].image_url || undefined,
        price: req.body.data.dishes[0].price || undefined,
        quantity: req.body.data.dishes[0].quantity || undefined
      }
    ],
  };

  if (!req.body.data.deliverTo){
    res.status(400).json({message: `Order must include a deliverTo`})
  }

  if (!req.body.data.mobileNumber){
    res.status(400).json({message: `Order must include a mobileNumber`})
  }

  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

//list
function list(req, res) {
  res.json({ data: orders });
}

//read
function read(req, res, next) {
  const orderId = (req.params.orderId);
  const foundOrder = orders.find((order) => order.id == orderId);

  console.log("read foundOrder: ", foundOrder)
  if (foundOrder){
    res.json({ data: foundOrder });
  } else {
    next(
        {status: 404, message: `Order does not exist for id: ${orderId}`}
    )
  }
}

function update(req, res, next) {
  const reqOrderId = (req.body.data.id);
  const paramsOrderId = (req.params.orderId);

  const foundOrder = orders.find((order) => order.id === paramsOrderId);

  if( reqOrderId && (reqOrderId !== paramsOrderId)) {
    return next(
        {status: 400, message: `Order id ${reqOrderId} does not match ${paramsOrderId}`})
  }

  const {
    data: {
      id,
      deliverTo,
      mobileNumber,
      status,
      dishes,
    } = {}
  } = req.body ;

  console.log("CREATE req.body.data.dishes", req.body.data.dishes)
  if (!req.body.data.dishes || !Array.isArray(req.body.data.dishes) || req.body.data.dishes.length === 0){
    return res.status(400).json({error: `Order must include a dish`})
  }

  let brokenDish = req.body.data.dishes.find((dish) => !dish.quantity || typeof dish.quantity !== "number");
  if ( brokenDish !== undefined) {
    return res.status(400).json({error: `Dish ${brokenDish.id} must have a quantity that is an integer greater than 0`})
  }

  if (!req.body.data.deliverTo){
    return res.status(400).json({error: `Order must include a deliverTo`});
  }

  if (!req.body.data.status || !ORDER_STATUSES.includes(req.body.data.status)){
    return res.status(400).json({error: `Order must have a status of pending, preparing, out-for-delivery, delivered`});
  }

  if (!req.body.data.mobileNumber){
    return res.status(400).json({error: `Order must include a mobileNumber`})
  }

  foundOrder.deliverTo = req.body.data.deliverTo;
  foundOrder.mobileNumber = req.body.data.mobileNumber;
  foundOrder.status = req.body.data.status;


  res.json({ data: foundOrder });

}

function orderExists(req, res, next) {
  const orderIdParams = Number(req.params.orderId);
  const foundOrder = orders.find((order) => order.id == orderIdParams);

  if (foundOrder){
    return next();
  } else {
    return next(
        {status: 404, message: `Order does not exist for id: ${orderIdParams}`}
    )
  }
}

function destroy(req, res, next) {
  const  orderIdParams = req.params.orderId;
  const index = orders.findIndex((order) => order.id === (orderIdParams));

  const foundOrder = orders.find((order) => order.id == orderIdParams);

  if (orderIdParams && foundOrder && (foundOrder.status !== "pending")){
    return next({
      status: 400,
      message: `An order cannot be deleted unless it is pending.`,
    });
  }

  if (foundOrder){
    if (index > -1) {
      orders.splice(index, 1);
    }
    res.sendStatus(204);
  }
}


module.exports = {
  list,
  read,
  create,
  update: [orderExists, update],
  delete: [orderExists, destroy],
};
