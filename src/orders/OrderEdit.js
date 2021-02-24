import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { deleteOrder, readOrder, updateOrder } from "../utils/api";
import OrderForm from "./OrderForm";
import ErrorAlert from "../layout/ErrorAlert";

function OrderEdit() {
  const history = useHistory();
  const { orderId } = useParams();

  const [order, setOrder] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    readOrder(orderId, abortController.signal).then(setOrder).catch(setError);
    return () => abortController.abort();
  }, [orderId]);

  function submitHandler(updatedOrder) {
    updateOrder(updatedOrder)
      .then((savedOrder) => history.push(`/orders/${savedOrder.id}`))
      .catch(setError);
  }

  function cancelHandler() {
    history.goBack();
  }

  function deleteHandler() {
    const confirmed = window.confirm(
      "Delete this order?\n\nYou will not be able to recover it."
    );
    if (confirmed) {
      deleteOrder(order.id)
        .then(() => history.push("/dashboard"))
        .catch(setError);
    }
  }

  const child = order.id ? (
    <OrderForm
      order={order}
      setOrder={setOrder}
      onCancel={cancelHandler}
      onSubmit={submitHandler}
      readOnly={order.status === "delivered"}
      showStatus={true}
    >
      <div className="mr-auto">
        <button
          type="button"
          className="btn btn-secondary mr-2"
          onClick={cancelHandler}
        >
          <span className="oi oi-x" /> Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={order.status === "delivered" || order.dishes.length === 0}
        >
          <span className="oi oi-check" /> Submit
        </button>
      </div>
      <div className="col-auto">
        <button
          type="button"
          className="btn btn-danger"
          title="Delete Order"
          disabled={order.status !== "pending"}
          onClick={deleteHandler}
        >
          <span className="oi oi-trash" />
        </button>
      </div>
    </OrderForm>
  ) : (
    <p>Loading...</p>
  );

  return (
    <main>
      <h1>Edit Order</h1>
      <ErrorAlert error={error} />
      {child}
    </main>
  );
}

export default OrderEdit;
