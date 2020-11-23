import React from "react";

function OrderItem({ name, quantity, price }) {
  return (
    <div className="form-row mb-2">
      <div className="col-md-2 col-lg-1">
        <input
          type="number"
          className="form-control"
          value={quantity}
          disabled={true}
        />
      </div>
      <div className="col">
        <input
          type="text"
          className="form-control"
          disabled={true}
          value={name}
        />
      </div>
      <div className="col-md-2 col-lg-1">
        <input
          type="text"
          className="form-control"
          disabled={true}
          value={`$ ${price}`}
        />
      </div>
      <div className="col-md-2 col-lg-1">
        <input
          type="text"
          className="form-control"
          disabled={true}
          value={`$ ${price * quantity}`}
        />
      </div>
    </div>
  );
}

export default OrderItem;
