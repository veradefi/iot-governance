import React, { Component } from 'react'
import KeyHealth from "./KeyHealth";
import * as web3Utils from "../../util/web3/web3Utils";

import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import ContractDAO from '../../util/web3/ContractDAO'
import AccountDAO from '../../util/web3/AccountDAO'
import { drizzleConnect } from 'drizzle-react'
import BigNumber from 'bignumber.js';
import createKeccak from 'keccak';

var $ = require ('jquery');
var eth1_amount=1000000000000000000;

class KeyApiCreate extends Component {
    static propTypes = {
        showDialog:PropTypes.func.isRequired,
        closeDialog:PropTypes.func.isRequired,
        api_auth: PropTypes.string.isRequired,
        api_key: PropTypes.string.isRequired,
        eth_contrib: PropTypes.number.isRequired,
        isAuthenticated: PropTypes.bool.isRequired,
        init_address:PropTypes.string,
        isNode:PropTypes.bool,
        key_address:PropTypes.string,
        callback:PropTypes.func
    };
  
  /**
   * Creates an instance of Key
   * @constructor
   * @param {any} props
   * @memberof Key
   */

  constructor(props, context) {
    super(props);

    this.drizzleState=context.drizzle.store.getState()
    this.contracts = context.drizzle.contracts
    this.state={
      loading:true
    }
  }

  get_keyInfo= (address) => {
    var self=this;
    var cfg=Object.assign({}, web3Utils.get_key_contract_cfg(address));
    var events=[];
    var web3=web3Utils.get_web3();
    var drizzle=this.context.drizzle;
    
    this.props.addContract(drizzle, cfg, events, web3) 
    self.setState({key_addr:address, myAddress:this.props.accounts[0], loading:false});

  }

componentDidMount() {
  this.get_keyInfo(this.props.key_address);
}
  
createApiKey = () => {
  var self=this;
  self.setState({loading:true});

  var username=$('#username').val();
  var password=$('#password').val();
  var auth_key=this.state.myAddress + ":" + username + ":" + password;
  var auth_key=auth_key.toLowerCase();
  var myAddress=this.state.myAddress.toLowerCase();
  
  
  var beneficiary=myAddress;
  var auth=myAddress;
  var cb=self.page2_api; 

  var auth_str=auth.toLowerCase(); //createKeccak('keccak256').update(auth.toLowerCase())._resetState().digest('hex');
  var auth_key_str=createKeccak('keccak256').update(auth_key.toLowerCase())._resetState().digest('hex');

  var drizzleState=this.context.drizzle.store.getState()
  var smartNode=self.state.key_addr;
      
  var amount=0; //Math.round(parseFloat(amount)*eth1_amount);

  this.contracts[smartNode].methods.addKeyAuth(
              auth_str.toLowerCase(), 
              auth_key_str.toLowerCase()
              ).send(
  {from: drizzleState.accounts[0], gasPrice:1000000000})
  .then(function(keyAddress)  {
      console.log('Key Address', keyAddress);
      self.props.closeDialog();
      self.props.callback( auth, auth_key_str.toLowerCase(), keyAddress );

  }).catch(function(error) {
      
      if (error.toString().match("32601") || error.toString().match("Method not found")) {
        console.log('Key Address', self.state.key_addr);
        self.props.closeDialog();
        self.props.callback( auth, auth_key_str.toLowerCase(), self.state.key_addr );
        return;
  
      }
      

      self.setState({loading:false})
          
      alert("Could not complete transaction")
      alert(error);
      console.log(error);
      self.props.closeDialog();
      self.props.callback( auth, '', self.state.key_addr );
  });


}

render() {
    var self=this;
    if (this.state.loading) {
      return <div>
                  <div className={"row"}>
                    <div className={"col-md-12 col-sm-12 col-xs-12"}>
                        <span className={"middle"}>
                        <center><img src={"images/wait.gif"} style={{width:"100%"}} /></center>
                        </span>
                    </div>
                </div>
            </div>
    }
    return(
      
        <div id={"page2_api"} >
            <div className={"row"}>
               <div className={"col-xs-12"}>    
                      <center>
                            <div className={"row"}>
                                <div className={"col-xs-12"}>
                                          <br/>
                                          <center><label className={"title1"} style={{ fontSize: "16px" }}>
                                          Create Smart Key API Access Token<br/>
                                          (Rinkeby Ethereum Network)
                                          </label></center>
                                          <br/>                                                                                  
                                 </div>
                            </div>
                            {/*
                            <div className={"row"}>
                                <div className={"col-xs-12"}>
                                  <br/>
                                  <label className={"title3"}>
                                    API Key
                                  </label>
                                  <br/><br/>
                                </div>
                            </div>
                            */}
                            <div className={"row"}>
                                <div className={"col-xs-4"} style={{textAlign:"right"}}>
                        
                                  <label 
                                  className={"label2"}
                                  style={{ fontSize:"12px" }}

                                  >Email</label>
                                  
                                </div>
                                <div className={"col-xs-8"} style={{textAlign:"left"}}>
                                  
                                  <input name="username" className={"form-control m-input m-input--air m-input--pill"}  
                                  type={"text"} id={"username"} 
                                  placeholder={""} 
                                  />
                              
                                 </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-xs-4"} style={{textAlign:"right"}}>
                        
                                  <label 
                                  className={"label2"} 
                                  style={{ fontSize:"12px" }}
                                  >Select Password</label>
                                  
                                </div>
                                <div className={"col-xs-8"} style={{textAlign:"left"}}>
                                  
                                  <input name="password" className={"form-control m-input m-input--air m-input--pill"}  
                                  type={"password"} id={"password"} 
                                  placeholder={""}
                                  />
                                  <br/><br/>
                                 </div>
                            </div>
                            
                    
                            <div className={"row"}>
                                <div className={"col-xs-12"}>    
                                    <button type={"button"} id={'create_api_key'} className={"button3 btn btn-accent"}>
                                    <span className={"buttonText"}
                                    onClick={
                                      () => {
                                          self.createApiKey();

                                      }
                                    }
                                  >Create Smart Key Access Token</span></button>
                                    <br/><br/>
                                    <a href='/' className={"link2"}>Go back to home</a>
                                </div>
                            </div>
                            {/*
                            <div className={"row"}>
                                <div className={"col-xs-12"}>
                    
                                  <label className={"title3"}>
                                    Wallet
                                  </label>
                                  <br/><br/>
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-xs-12"} style={{textAlign:"center"}}>
                        
                                  <label className={"label2"}>Your wallet address:</label>
                                  
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-xs-12"} style={{textAlign:"center"}}>
                                    <input name="address" className={"address_val inputbox3 form-control m-input m-input--air"}  
                                                        style={{width:"100%"}} 
                                                        type={"text"} 
                                                        id={"address"} 
                                                        placeholder={""} 
                                                        value={this.props.address}
                                                        onChange={() => {
                                                        }}
                                                     />
                                 </div>
                            </div>
                                                    */}
                    </center>
            </div>
        </div>
    </div>
                    
    )
  }
}


KeyApiCreate.contextTypes = {
  drizzle: PropTypes.object
}



const stateToProps = state => {
  return {
      api_auth: state.auth.api_auth,
      api_key: state.auth.api_key,
      eth_contrib: state.auth.eth_contrib,
      isAuthenticated: state.auth.isAuthenticated,

  };
};

const drizzleStateToProps = state => {
  return {
      drizzleStatus: state.drizzleStatus,
      accounts: state.accounts,
      contracts: state.contracts

  };
};

/**
 *
 * @function dispatchToProps React-redux dispatch to props mapping function
 * @param {any} dispatch
 * @returns {Object} object with keys which would later become props to the `component`.
 */

const dispatchToProps = dispatch => {
  return {
      showDialog: (show, content) => {
          dispatch(actions.showDialog(show, content));
      },
      closeDialog: () => {
          dispatch(actions.closeDialog());
      },
      authSuccess: (api_auth, api_key) => {
          dispatch(actions.authSuccess(api_auth, api_key));
      },
      authEthContrib: (eth_contrib) => {
          dispatch(actions.authEthContrib(eth_contrib));
      },
     
  };
};

const drizzleDispatchToProps = dispatch => {
  return {
      addContract: (drizzle, poolcfg, events, web3) => {
          dispatch(actions.addContract(drizzle, poolcfg, events, web3));
      },
  };
};




export default connect( stateToProps, dispatchToProps)( drizzleConnect(KeyApiCreate,drizzleStateToProps, drizzleDispatchToProps))
