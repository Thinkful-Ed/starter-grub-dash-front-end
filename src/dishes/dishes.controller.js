const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");
const validate = require("../utils/validators");

// TODO: Implement the /dishes handlers needed to make the tests pass

const executeValidation = (validationResult, res) => {
  if (validationResult !== true) {
    res.status(validationResult.status)
      .json({error: validationResult.message});
  }
}

//create
function create(req, res) {
  const{ data: { name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url
  };

    executeValidation(
      validate.dishStrings(newDish.name, "name"), res);
    executeValidation(
      validate.dishStrings(newDish.description, "description"), res);
    executeValidation(
      validate.dishStrings(newDish.price, "price"), res);
    executeValidation(
      validate.dishPrice(newDish.price), res);
    executeValidation(
      validate.dishStrings(newDish.image_url, "image_url"), res);

   dishes.push(newDish);
   res.status(201).json({ data: newDish });
}
//read
function read(req, res, next) {
    const dishId = (req.params.dishId);
  const foundDish = dishes.find((dish) => dish.id == dishId);
  
  //console.log("read foundDish: ", foundDish)
  if (foundDish){
    res.json({ data: foundDish });  
  } else {
   next(
   {status: 404, message: `Dish does not exist for id: ${dishId}`} 
   )
  }
}


function update(req, res, next) {
  const reqDishId = (req.body.data.id);
  const paramsDishId = (req.params.dishId);
//     console.log("update DishIdreq: ", reqDishId)
//     console.log("update DishIdparams: ", paramsDishId)
 
  //because we use the params, params has to be given, the id in the body could be null or undefined, or not given in the body of the request, so this can be why the found dish is only by the params value.
  const foundDish = dishes.find((dish) => dish.id == paramsDishId);
     //console.log("update foundDishId: ", foundDish.id) 
  
   if( reqDishId && (reqDishId !== paramsDishId))
  {
    //console.log("mismatch ID!")
   return next(
      {status: 400, message: `Dish id ${reqDishId} does not match ${paramsDishId}`}) 
  } 
  
  if( !foundDish ){
    next(
     {status: 404, message: `Dish does not exist: ${paramsDishId}`} 
   )
  }
  const { data: { id, name, description, price, image_url } = {} } = req.body;
  
 
  
  //Validations:
  //console.log('entering validations UPDATE')
  executeValidation(
      validate.dishStrings(req.body.data.name, "name"), res);
    executeValidation(
      validate.dishStrings(req.body.data.description, "description"), res);
    executeValidation(
      validate.dishStrings(req.body.data.price, "price"), res);
    executeValidation(
      validate.dishPrice(req.body.data.price), res);
    executeValidation(
      validate.dishStrings(req.body.data.image_url, "image_url"), res);

  
  
  foundDish.name = req.body.data.name;
  foundDish.description = req.body.data.description;
  foundDish.price = req.body.data.price;
  foundDish.image_url = req.body.data.image_url;
  foundDish.id = paramsDishId;
  
  res.json({ data: foundDish });
}

//list
function list(req, res) {
    res.json({ data: dishes });  
}

function dishExists(req, res, next) {
  const dishIdParams = Number(req.params.dishId);
  const foundDish = dishes.find((dish) => dish.id == dishIdParams);
  const { data: {id} = {} } = req.body;
  
  if (foundDish){
    return next();
  } else if (!req.body.id) {
   next(
     {status: 404, message: `Dish does not exist for id: ${req.body.id}`} 
         )
  }
}

module.exports = {
  create: [create],
  list,
  update: [ dishExists, update],
  read,
};
