import React from "react";

function DishCard({ dish, children }) {
  return (
    <div className="col-sm-12 col-md-6 col-lg-3 my-2">
      <div className="card">
        <img
          src={dish.image_url}
          className="card-img-top"
          alt={`${dish.name} interior`}
        />
        <div className="card-body">
          <h5 className="card-title text-truncate">{dish.name}</h5>
          <p className="card-text">{dish.description}</p>
          <p className="card-text">$ {dish.price}</p>
        </div>
        <div className="card-footer">{children}</div>
      </div>
    </div>
  );
}

export default DishCard;
