import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux'
import getWeb3 from './util/web3/getWeb3'
import { DrizzleProvider } from 'drizzle-react'
import drizzleOptions from './drizzleOptions'
import { LoadingContainer } from 'drizzle-react-components'
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

var basename="/iotpedia"
ReactDOM.render((
  <DrizzleProvider options={drizzleOptions} >
    <Provider store={store}>
      <LoadingContainer>

        <BrowserRouter basename="/">
          <App />
        </BrowserRouter>
      </LoadingContainer>
      </Provider>
    </DrizzleProvider>

  ),
  document.getElementById('root')
)
