import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import DishForm from "./DishForm";
import ErrorAlert from "../layout/ErrorAlert";
import { createDish } from "../utils/api";

function DishCreate() {
  const history = useHistory();

  const [error, setError] = useState(null);

  function submitHandler(dish) {
    const abortController = new AbortController();
    createDish(dish, abortController.signal)
      .then(() => history.push(`/dashboard`))
      .catch(setError);
    return () => abortController.abort();
  }

  function cancelHandler() {
    history.goBack();
  }

  return (
    <main>
      <h1>Create Dish</h1>
      <ErrorAlert error={error} />
      <DishForm onSubmit={submitHandler} onCancel={cancelHandler} />
    </main>
  );
}

export default DishCreate;
