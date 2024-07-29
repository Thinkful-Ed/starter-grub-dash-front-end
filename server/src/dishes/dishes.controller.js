const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

/*

Dishes Validations

*/

function dishExists(req, res, next) {
  const dishId = String(req.params.dishId);
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish does not exist: ${dishId}`,
  });
}

function dishOrderIdIsValid(req, res, next) {
  const dishId = req.params.dishId;
  const { data: { id } = {} } = req.body;
  if (id === dishId || !id) {
    return next();
  }
  next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
  });
}

function bodyDataHasProperty(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Dish must include a '${propertyName}'` });
  };
}

function priceIsValidNumber(req, res, next) {
  const { data: { price } = {} } = req.body;
  if (price <= 0 || !Number.isInteger(price)) {
    next({
      status: 400,
      message: `'price' requires a valid number, but was: ${price}`,
    });
  }
  next();
}

/*

Dishes Functions

*/

function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function list(req, res) {
  res.json({ data: dishes });
}

function read(req, res) {
  const { dish } = res.locals;

  res.json({ data: dish });
}

function update(req, res, next) {
  const dish = res.locals.dish;
  const { data: { id, name, description, price, image_url } = {} } = req.body;

  if (id !== dish.id) {
    next({
      status: 400,
      message: `Update request dish id: ${id} does not match the target dish id: ${dish.id}`,
    });
  }

  // Update the dish
  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;

  res.json({ data: dish });
}

module.exports = {
  create: [
    bodyDataHasProperty("name"),
    bodyDataHasProperty("description"),
    bodyDataHasProperty("price"),
    bodyDataHasProperty("image_url"),
    priceIsValidNumber,
    create,
  ],
  list,
  read: [dishExists, read],
  update: [
    dishExists,
    dishOrderIdIsValid,
    bodyDataHasProperty("name"),
    bodyDataHasProperty("description"),
    bodyDataHasProperty("price"),
    bodyDataHasProperty("image_url"),
    priceIsValidNumber,
    update,
  ],
  dishExists,
};
