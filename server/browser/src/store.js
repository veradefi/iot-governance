import thunk from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import * as reducers from "./store/reducers";
const rootReducer = combineReducers(reducers);

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store
