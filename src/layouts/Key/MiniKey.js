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
import ImageUploader from 'react-images-upload';
var QRCode = require('qrcode.react');
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
        transferAmt:1,
        pictures: []
        //keyInfo:props.keyInfo,
        
    };
    
  }

  onDrop = (picture) => {
    this.setState({
        pictures: this.state.pictures.concat(picture),
    });
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
                    <QRCode value={this.state.address} /><br/>
                    <b>{this.state.address}</b>
                    <br/>
                    </center>
            </div>
                <div className={"col-xs-12 upload-btn-wrapper"}>
            
            <center>
            
            {/*
            <ImageUploader
                withIcon={true}
                withLabel={false}
                withButton={true}
                withPreview={true}
                //singleImage={true}
                buttonText='Upload Image'
                onChange={this.onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
            />
            */}
            
            </center>

            <Button primary raised 
            style={{ width: "100%" }}
            onClick={() => {
                self.props.showDialog(true, 
                    <center>

             <textarea
             className={"auth_key"} 
             id={'auth_api_key'}  
             style={{ width:"100%", 
                      height:"30px",
                      textAlign:'left', 
                      background:'white'}} 
                      value={this.state.address} 
                    onChange={() => {}}> 
            </textarea>
            <br/>
            <div className={"input-group"}>
                <button   
                    onClick={() => {
                        var txt=document.getElementById('auth_api_key');
                        //txt.focus();
                        txt.select();
                        document.execCommand('copy')
                        var tweetbtn=document.getElementById('tweetbtn');
                        tweetbtn.focus();
                    }}  
                    style={{ width: "100%" }}
                className={"div-control button3 btn btn-primary"} 
                type={"button"} 
                >
                <span className={"buttonText"}>1. Copy Wallet Address</span>
                </button>
                
            </div>
            <br/>
            <a className="twitter-share-button div-control button3 btn btn-primary" target="_newwindow"
                id="tweetbtn"
                href={"https://twitter.com/intent/tweet?text=" + this.state.address }
                data-size="large"
                style={{ width: "100%" }}
                >
                <span className={"buttonText"}>
                2. Tweet Wallet Address on Twitter
                </span>
                </a>
            <br/>
            <br/>
            <a className={"div-control button3 btn btn-primary"} 
                target="_newwindow2"
                href={"https://faucet.rinkeby.io"}
                data-size="large"
                style={{ width: "100%" }}
                >
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
            <hr/>
            </div>


            <div className={"col-xs-6"}>
                    <b>ETH Balance</b>
                    
            </div>
            <div className={"col-xs-6"}>
                    <div align={"right"}>
                    <b>{this.state.balance} ETH</b>
                    </div>
            </div>
            <div className={"col-xs-12"}>
            <hr/>
            </div>
            <div className={"col-xs-6"}>
                    <b>Token Balance</b>
                    
            </div>
            <div className={"col-xs-6"}>
                    <div align={"right"}>
                    <b><span>
                    <ContractDAO contract={"SmartKey"} 
                                                        method="getBalance" 
                                                        methodArgs={[this.state.address]} 
                                                        isLocaleString={true} />

                                        <font size={2}> IOTBLOCK</font>
                                        </span></b>
                    </div>
            </div>
            <div className={"col-xs-12 upload-btn-wrapper"}>
                    <hr/>
            </div>

            <div className={"col-xs-6"}>
                    <b>Currency</b>
                    
            </div>
            <div className={"col-xs-6"}>
                    <div align={"right"}>
                    <b>ETH</b>
                    </div>
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
  