import React, { Component } from 'react'
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import { HiddenOnlyAuth, VisibleOnlyAuth } from './util/wrappers.js'

import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as actions from "./store/actions";

import Nav from './layouts/Nav/Nav'
import Header from './layouts/Header/Header'
// UI Components
import Home from './layouts/home/Home'
import Key from './layouts/Key/Key'
import Map from './layouts/Map/Map'
import Browser from './layouts/Browser/Browser'
import Dashboard from './layouts/dashboard/Dashboard'
import Dialog from './layouts/Dialog/Dialog'
import Explorer from './layouts/Explorer/Explorer'

// Styles

//import './css/oswald.css'
//import './css/open-sans.css'
//import './css/pure-min.css'

//import './css/style.bundle.css'
//import './css/vendors.bundle.css'
//import './App.css'

@withRouter
export default class App extends Component {

  componentDidMount() {
    fetch('/cat')
      .then(response => {
        console.log(response);
        response.json();
      })
      .then((proposals) => { 
        console.log(proposals);
        this.setState({ proposals }); 
      });
  }

  render() {
 

    return (
      <div className="App" style={{
        background: "#f5f5f5",
        overflowX: "hidden",

        }}>
        
        <Header />

          <div style={{ width:"100%", padding:"22px",  }}>
            <table style={{width:"100%", height:"100%",margin:"0px",padding:"0px"}}>
              <tbody>
              <tr><td style={{minWidth:"150px", width:"150px", height:"100%", background:'white',
               boxShadow: "0 2px 7px 0 rgba(160, 160, 160, 0.5)",
               border: "solid 1px #e7e7e7"
            
            }} valign={"top"}>
           

              <Nav />
            </td><td style={{width:"80%", height:"100%", background:'white',
          boxShadow: "0 2px 7px 0 rgba(160, 160, 160, 0.5)",
          border: "solid 1px #e7e7e7"
        }}  valign={"top"}>
               <Switch>
                  <Route exact path="/" component={Key} />
                  <Route exact path="/key" component={Key} />
                  <Route exact path="/key.html" component={Key} />
                  <Route exact path="/browser" component={Browser} />
                  <Route exact path="/browser.html" component={Browser} />
                  <Route exact path="/editor" component={Browser} />
                  <Route exact path="/editor.html" component={Browser} />
                  <Route exact path="/explorer" component={Explorer} />
                  <Route exact path="/explorer.html" component={Explorer} />
                  <Route exact path="/map" component={Map} />
                  <Route exact path="/map.html" component={Map} />
                  <Route exact path="dashboard" component={Dashboard} />
                  <Redirect from="*" to="/" />
              </Switch>
            </td></tr>
              </tbody>
            </table>
          </div>
          <Dialog />
      </div>
    );
  }
}

