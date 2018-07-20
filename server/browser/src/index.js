import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux'
import getWeb3 from './util/web3/getWeb3'

// Layouts
import App from './App'

// Redux Store
import store from './store'

// Initialize react-router-redux.
//const history = syncHistoryWithStore(browserHistory, store)

// Initialize web3 and set in Redux.
getWeb3
.then(results => {
  console.log('Web3 initialized!')
})
.catch(() => {
  console.log('Error in web3 initialization.')
})

ReactDOM.render((
    <Provider store={store}>
      <BrowserRouter basename="iotpedia">
        <App />
      </BrowserRouter>
    </Provider>
  ),
  document.getElementById('root')
)
