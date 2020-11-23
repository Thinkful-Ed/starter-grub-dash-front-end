import React, { useEffect, useState } from "react";
import { readOrder } from "../utils/api";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import OrderForm from "./OrderForm";

function OrderConfirmed() {
  const history = useHistory();
  const { orderId } = useParams();

  const [order, setOrder] = useState({ dishes: [] });
  const [error, setError] = useState(null);

  useEffect(loadOrder, [orderId]);

  function loadOrder() {
    const abortController = new AbortController();

    readOrder(orderId, abortController.signal).then(setOrder).catch(setError);

    return () => abortController.abort();
  }

  function cancelHandler() {
    history.push("/");
  }

  const child = order.id ? (
    <OrderForm order={order} readOnly={true} showStatus={true}>
      <div className="col-auto">
        <button
          type="button"
          className="btn btn-secondary mr-2"
          onClick={cancelHandler}
        >
          <span className="oi oi-home" /> Home
        </button>
      </div>
    </OrderForm>
  ) : (
    <p>Loading...</p>
  );

  return (
    <main>
      <h1>Order Confirmed</h1>
      <ErrorAlert error={error} />
      {child}
    </main>
  );
}

export default OrderConfirmed;
