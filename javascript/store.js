import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./reducers";
import middleware from "./middleware";
import { ActionCreators } from "./actions";
let store;
if (process.env.MODE !== "production") {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(...middleware))
  );
} else {
  store = createStore(reducers, applyMiddleware(...middleware));
}

export default store;
