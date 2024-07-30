import React, { useState } from "react";
import Header from "./Header";
import NotFound from "./NotFound";
import Menu from "./Menu";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import Home from "../home/Home";
import OrderCreate from "../orders/OrderCreate";
import OrderEdit from "../orders/OrderEdit";
import DishEdit from "../dishes/DishEdit";
import DishCreate from "../dishes/DishCreate";
import Dashboard from "../dashboard/Dashbaord";
import OrderConfirmed from "../orders/OrderComfired";

const initialState = {
  deliverTo: "",
  mobilePhone: "",
  status: "pending",
  dishes: [],
};

function Layout() {
  const history = useHistory();
  const [order, setOrder] = useState({ ...initialState });

  function addToCart(newDish) {
    setOrder((previousOrder) => {
      const index = previousOrder.dishes.findIndex(
        (dish) => dish.id === newDish.id
      );

      if (index === -1) {
        return {
          ...previousOrder,
          dishes: previousOrder.dishes.concat({ ...newDish, quantity: 1 }),
        };
      }

      const dishes = previousOrder.dishes.map((dish) => ({
        ...dish,
        quantity: dish.quantity + (dish.id === newDish.id),
      }));

      return {
        ...previousOrder,
        dishes,
      };
    });
  }

  function onSubmit(newOrder) {
    setOrder({ ...initialState });
    history.push(`/orders/${newOrder.id}/confirmed`);
  }

  return (
    <>
      <Header />
      <Menu
        cartCount={order.dishes.reduce((sum, dish) => sum + dish.quantity, 0)}
      />
      <div className="container">
        <Switch>
          <Route exact={true} path="/orders">
            <Redirect to={"/dashboard"} />
          </Route>
          <Route exact={true} path="/dishes">
            <Redirect to={"/dashboard"} />
          </Route>
          <Route path="/orders/new">
            <OrderCreate
              order={order}
              setOrder={setOrder}
              onSubmit={onSubmit}
            />
          </Route>
          <Route path="/orders/:orderId/confirmed">
            <OrderConfirmed />
          </Route>
          <Route path="/orders/:orderId/edit">
            <OrderEdit />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/dishes/:dishId/edit">
            <DishEdit />
          </Route>
          <Route path="/dishes/new">
            <DishCreate />
          </Route>
          <Route exact={true} path="/">
            <Home addToCart={addToCart} />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </>
  );
}

export default Layout;
