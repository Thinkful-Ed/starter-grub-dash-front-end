import React from "react";

function OrderFormDish({
  dish: { id, name, quantity, price },
  setDishQuantity,
  deleteDish,
  readOnly,
}) {
  function changeHandler({ target: { value } }) {
    setDishQuantity(id, Number(value));
  }

  function deleteHandler() {
    deleteDish(id);
  }

  return (
    <div className="form-row mb-2">
      <div className="col-md-2 col-lg-1">
        <input
          type="number"
          className="form-control"
          name={id}
          value={quantity}
          disabled={readOnly}
          onChange={changeHandler}
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
      {readOnly === false && (
        <div className="col-auto">
          <button
            type="button"
            className="btn btn-danger"
            onClick={deleteHandler}
          >
            <span className="oi oi-trash" />
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderFormDish;
