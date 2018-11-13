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

class KeyCreate extends Component {
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
      loading:false,
      myAddress:this.props.accounts[0]
    }
  }

componentDidMount() {
}

createSmartKey = () => {
    var self=this;
    
    var eth1=1000000000000000000;
    
    var beneficiary=$('#address').val();
    this.setState({loading:true});
            
    var drizzleState=this.context.drizzle.store.getState()
    var smartNode="SmartKey";
        
    self.contracts[smartNode].methods.getSmartKey(beneficiary).call(
        {from: web3Utils.get_address()}).then(function (keyAddress) {
            if (keyAddress.toString() != '0x0000000000000000000000000000000000000000') {
                //alert(keyAddress);
                console.log('Key Address', keyAddress);
                self.props.closeDialog();
                self.props.callback( web3Utils.get_address());
            } else {
                    self.contracts[smartNode].methods.loadSmartKey(
                        keyAddress, beneficiary, web3Utils.get_web3().utils.fromAscii("Deposit"), 
                                ).send(
                    {from: web3Utils.get_address(), gasPrice:1000000000})
                    .then(function(keyAddress)  {
                        self.contracts[smartNode].methods.getSmartKey(beneficiary).call(
                            {from: web3Utils.get_address()}).then(function (keyAddress) {
                                    console.log('Key Address', keyAddress);

                                    self.props.closeDialog();
                                    self.props.callback( web3Utils.get_address());
                                    
                            });
                    }).catch(function(error) {
                        if (error.toString().match("32601") || error.toString().match("Method not found")) {
                            self.contracts[smartNode].methods.getSmartKey(beneficiary).call(
                                {from: web3Utils.get_address()}).then(function (keyAddress) {
                                        console.log('Key Address', keyAddress);
    
                                        self.props.closeDialog();
                                        self.props.callback( web3Utils.get_address());
                                        
                                });
                      
                        } else {
                            self.setState({loading:false})
                                
                            alert("Could not complete transaction")
                            alert(error);
                            console.log(error);
                        }
                    });
            }
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
      
        <div id={"page1"}>
            <div className={"row"}>
                <div className={"col-xs-12"}>    
                            <center>
                                <div className={"row"}>
                                    <div className={"col-xs-12"}>
                                            <br/><br/>
                                            <center><label className={"title1"}>Create Smart Key<br/>(Rinkeby Ethereum Network)</label></center>
                                            <br/>
                                            
                                            
                                    </div>
                                </div>
                                <div className={"row"}>
                                    <div className={"col-xs-12"}>
                        
                                        <div className={"row"}>
                                            
                                            <div className={"col-xs-12"}>
                                                <center>
                                                        <label className={"label2"}>Your wallet address:</label>
                                                </center>
                                            </div>
                                        </div>
                                        <div className={"row"}>
                                            <div className={"col-xs-12"}>
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
                    
                                    </div>
                                </div>
                                            
                                <div className={"row"}>
                                    <div className={"col-xs-12"} style={{textAlign:'center'}}>    
                                        <br/>
                                            <label className={"label3"}>1 ETH is the minimum ETH needed to create Smart Key.</label>
                                    </div>
                                </div>
                                <br/>
                                
                        
                                <div className={"row"}>
                                    <div className={"col-xs-12"}>    
                                        <button type={"button"} 
                                        id={'pool'} 
                                        onClick={
                                            () => {
                                                self.createSmartKey();
                                            }
                                        }
                                        className={"button3 btn btn-accent"}>
                                            <span 
                                                className={"buttonText"}>Create Smart Key</span></button>
                                             <br/><br/>
                                             <a href='/' className={"link2"}>Go back to home</a>
                                    
                                    </div>
                                </div>
                        </center>
                </div>
            </div>
        </div>
    )
  }
}



KeyCreate.contextTypes = {
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
  
  
  
  
  export default connect( stateToProps, dispatchToProps)( drizzleConnect(KeyCreate,drizzleStateToProps, drizzleDispatchToProps))
  