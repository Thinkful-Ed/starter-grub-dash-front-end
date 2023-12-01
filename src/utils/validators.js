
function dishStrings(variable, objectParam, code = 400 ) {
  if (!variable || variable == ''){
    return {
      status: code,
       message:  "Dish must include " + objectParam,
     };
  }
  
  return true;
}

function dishPrice(variable, code = 400) {

  if (variable < 0 || Number(variable) !== variable){
    return {
      status: code,
      message:  "Dish must have a price that is an integer greater than 0",
    };
  }
  
  return true;
}


function orderStrings(variable, objectParam, code = 400 ) {
  if (!variable || variable == ''){
    return {
      status: code,
       message:  "Order must include " + objectParam,
     };
  }
  
  return true;
}

function orderPrice(variable, code = 400) {

  if (variable < 0 || Number(variable) !== variable){
    return {
      status: code,
      message:  "Order must have a price that is an integer greater than 0",
    };
  }
  
  return true;
}

function orderStatus(variable, objectParam, code = 400) {

  if (!variable || variable == ''){
    return {
      status: code,
      message:  `Order must have a ${objectParam} of pending, preparing, out-for-delivery, delivered`,
    };
  }
  
  return true;
}

module.exports = {dishStrings, dishPrice, orderStrings, orderPrice, orderStatus};