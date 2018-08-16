//import thunk from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import * as reducers from "./store/reducers";
//import { browserHistory } from 'react-router'
import thunkMiddleware from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
//import reducer from './reducer'
import rootSaga from './rootSaga'
import createSagaMiddleware from 'redux-saga'
import { routerReducer } from 'react-router-redux'
import { drizzleReducers } from 'drizzle'
import { generateContractsInitialState } from 'drizzle'
import drizzleOptions from './drizzleOptions'

const reducer = combineReducers({
  routing: routerReducer,
  ...reducers,
  ...drizzleReducers
})

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//const routingMiddleware = routerMiddleware(browserHistory)
const sagaMiddleware = createSagaMiddleware()

//console.log(generateContractsInitialState);

const initialState = {
  contracts: generateContractsInitialState(drizzleOptions)
}

//const rootReducer = combineReducers(reducers);

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      //routingMiddleware,
      sagaMiddleware
    )
  )
)

sagaMiddleware.run(rootSaga)

/*
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
*/

export default store
