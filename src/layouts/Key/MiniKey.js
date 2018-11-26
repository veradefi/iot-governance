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
import {Button, IconButton} from 'react-toolbox/lib/button';

var $ = require ('jquery');
var eth1_amount=1000000000000000000;


class MiniKey extends Component {
    static propTypes = {
        
    };
  
  /**
   * Creates an instance of NodeKeyInfo
   * @constructor
   * @param {any} props
   * @memberof NodeKeyInfo
   */

  constructor(props, context) {
    super(props);

    //this.drizzleState=context.drizzle.store.getState()
    //this.contracts = context.drizzle.contracts

    this.state = {
        loading:true,
        transferAmt:0.1,
        //keyInfo:props.keyInfo,
        
    };
    
  }


  getKeyStatus = () => {
    var self=this;
      
    var eth_salt = web3Utils.getCookie('iotcookie');
    if (window.eth_salt) {
        eth_salt=window.eth_salt;
    }
    if (eth_salt == null) {
        web3Utils.setCookie('iotcookie',new Date().toUTCString(),7);
        eth_salt = web3Utils.getCookie('iotcookie');
    }
    
    
    var check_key=function(address) {
        console.log('address' + address);
        web3Utils.get_web3().eth.getBalance(address).then(function (bal) {
            self.setState({balance:parseFloat(bal)/eth1_amount})
        })
        self.setState({loading:false, address:address})
    }

    web3Utils.init_wallet(eth_salt, check_key);
    
  }
  componentDidMount() {
      var self=this;
      var address=this.props.init_address;
      
      if (!address) {
            this.getKeyStatus();
      } else {
            self.get_smart_key_info(address);



      }

  }
  
  render() {
    var self=this;
    var eth1=1000000000000000000;
    if (this.state.loading) {
        return <div>Loading Eth Address...</div>
    }
    return <div className={"row"}>
            <div className={"col-xs-12"}>
                    
                    <center>
                    <h3>My Account</h3>
                    <br/>
                    
                    {this.state.balance ? <div><b>ETH Balance: {this.state.balance} ETH</b><br/></div> : null}
                    <br/>
                    <span>
                    <b>Token Balance:
                    <ContractDAO contract={"SmartKey"} 
                                                        method="getBalance" 
                                                        methodArgs={[this.state.address]} 
                                                        isLocaleString={true} />

                                        <font size={2}> IOTBLOCK</font>
                                        </b>                    
                                        </span>
                    <br/>
                    <br/>
                   
                    </center>

                    <Button primary raised 
                    style={{ width: "100%" }}
                    onClick={() => {
                        self.props.showDialog(true, 
                            <center>

                     <textarea readonly
                     className={"auth_key"} 
                     id={'auth_api_key'}  
                     style={{ width:"100%", 
                              height:"30px",
                              textAlign:'left', 
                              background:'white'}} 
                              value={this.state.address} 
                            onChange={() => {}}/>
                    <br/><br/>
                    <div className={"input-group"}>
                        <button   
                            onClick={() => {
                                var txt=document.getElementById('auth_api_key');
                                txt.focus();
                                txt.select();
                                document.execCommand('copy')

                            }}  
                            style={{ width: "100%" }}
                        className={"div-control button3 btn btn-primary"} 
                        type={"button"} 
                        >
                        <span className={"buttonText"}>1. Copy Wallet Address</span>
                        </button>
                        
                    </div>
                    <br/>
                    <a class="twitter-share-button" target="_newwindow"
                        href={"https://twitter.com/intent/tweet?text=" + this.state.address }
                        data-size="large"
                        style={{ width: "100%" }}
                        className={"div-control button3 btn btn-primary"} >
                        <span className={"buttonText"}>
                        2. Tweet Wallet Address on Twitter
                        </span>
                        </a>
                    <br/>
                    <br/>
                    <a class="twitter-share-button" target="_newwindow2"
                        href={"https://faucet.rinkeby.io"}
                        data-size="large"
                        style={{ width: "100%" }}
                        className={"div-control button3 btn btn-primary"} >
                        <span className={"buttonText"}>
                        3. Paste Tweet URL to Rinkeby Faucet
                        </span>
                        </a>
                     <br/>
                     <br/>
                     <Button primary raised 
                    style={{ width: "100%" }}
                    onClick={() => {
                        self.props.closeDialog();
                    }}>Close</Button>
                    </center>
                            );
                    }}
                    >Deposit</Button>
                    
            </div>
        </div>
  }

    
}


MiniKey.contextTypes = {
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
  
  
  
  
  export default connect( stateToProps, dispatchToProps)( drizzleConnect(MiniKey,drizzleStateToProps, drizzleDispatchToProps))
  