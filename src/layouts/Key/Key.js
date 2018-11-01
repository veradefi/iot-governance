import '../../App.css';
import React, { Component } from 'react';
import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import KeyApiCreate from "./KeyApiCreate";
import KeyCreate from "./KeyCreate";
import KeyHealth from "./KeyHealth";
import KeyInfo from "./KeyInfo";
import NodeKeyInfo from "./NodeKeyInfo";
import * as web3Utils from "../../util/web3/web3Utils";
import ContractDAO from '../../util/web3/ContractDAO'
import AccountDAO from '../../util/web3/AccountDAO'
import { drizzleConnect } from 'drizzle-react'
import BigNumber from 'bignumber.js';
import createKeccak from 'keccak';
import LoadingContainer from '../../LoadingContainer';

var eth1_amount=1000000000000000000;


var $ = require ('jquery');

class Key extends Component {
    static propTypes = {
        showDialog:PropTypes.func.isRequired,
        closeDialog:PropTypes.func.isRequired,
        api_auth: PropTypes.string.isRequired,
        api_key: PropTypes.string.isRequired,
        eth_contrib: PropTypes.number.isRequired,
        isAuthenticated: PropTypes.bool.isRequired,
        init_address:PropTypes.string,
        isNode:PropTypes.bool,
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

    this.state = {
        isSmartKey:true,
        myAddress:props.isNode && props.init_address ? props.init_address : '0x0',
        keyAddress:props.isNode && props.init_address ? props.init_address : '0x0',
        api_key:'',
        api_auth:'',            
        page1_init:false,
        page2_api_init:false,
        health_init:false,
        loading:true,

    };
    //this._isMounted = false;
  }


  add_auth = (xhr) => {
    var self=this;
    var api_auth=self.props.api_auth;
    var api_key=self.props.api_key;
    var eth1=1000000000000000000;
    var eth_contrib=1;
    if (self.props.eth_contrib) {
        eth_contrib=parseFloat(self.props.eth_contrib) * eth1;
    }
    var data="Token api_key=\"" + api_key + "\" auth=\"" + api_auth + "\" eth_contrib=\"" + eth_contrib + "\"";
    data=btoa(data);
    data=btoa(data + ':' + '');
    xhr.setRequestHeader("Accept","application/vvv.website+json;version=1");
    xhr.setRequestHeader("Authorization", data); 

  }
  
  showPage1 = (address) => {
    var self=this;
    this.setState({page1_init:true});
    console.log("show page1 dialog")
    this.props.showDialog(true, <KeyCreate address={address} callback={self.page2} />);
    
  }

  hidePage1 = () => {
    if (this.state.page1_init) {
        this.props.closeDialog();
        this.setState({page1_init:false});
       
    } else {
        this.props.closeDialog();
    
    }
 }

 
showPage2_api= () => {
    var self=this;
    this.setState({page2_api_init:true});
    this.props.showDialog(true, <KeyApiCreate address={this.state.myAddress}  key_address={self.state.keyAddress}  callback={self.page2_api} />);
    
  
}

hidePage2_api = () => {
   if (this.state.page2_api_init) {
    this.props.closeDialog();
    this.setState({page2_api_init:false});
   } else {
    this.props.closeDialog();
   }
}

page2_api = (auth, auth_info, key_address)  => {
    var self=this;
   //$('#page2').show();
    this.setState({
        keyAddress:key_address
    });

   if (key_address.length == 0) {
        this.setState({loading:false});
        self.showPage1(auth) ;
        //$('#page2').hide();
        //self.hidePage2_api();
   } else if (auth_info.length == 0) {
        this.setState({loading:false});
        //self.hidePage1();
        //$('#page2').hide();
        self.showPage2_api();
   } else {
        this.setState({loading:true});
        //self.hidePage1();
        //$('#page2').hide();
        //self.hidePage2_api();
        this.props.authSuccess( auth, auth_info, key_address);
        this.setState({
            api_key:auth_info,
            api_auth:auth   
        });
        self.get_smart_key_info(auth);
   }
   //$('#page2').show();

}


get_smart_key_info = (address) => {
    var self=this;
    console.log("Getting Smart Key Info " + address);
    $.ajax({
            beforeSend: function(xhr){
                self.add_auth(xhr);
        
                //setHeaders(xhr);
            
            },
            type: 'GET',
            url: '/cat/getSmartKey?address=' + encodeURI(address),
            //data: JSON.stringify(user_item),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(body, textStatus, xhr) {
                self.fill_page2(address, body["address"], body["balance"], body["eth_recv"], body["vault"], body["state"], body["health"], body["tokens"], body["isOwner"]);
            },
            error: function(xhr, textStatus, err) {
                console.log(xhr.status + ' ' + xhr.statusText);
            }
        });
}

fill_page2 = (userAddress, address, balance, eth_recv, vault, state, health, tokens, isOwner)  => {
   var self=this;
   console.log(userAddress, address, balance, eth_recv, vault, state, health, tokens);
   this.setState({loading:true});
   //self.hidePage1();
   //$('#page2').hide();
   //self.hidePage2_api();

    if (address == '0' || address == '0x0000000000000000000000000000000000000000') {
        self.setState({
            myAddress:userAddress,
            keyAddress:address,
            loading:false, 
            showKeyInfo:false
        });    
        self.showPage1(userAddress) ;
        //$('#page2').hide();
        return;
    } else {
       var myAddress=userAddress;
       var keyAddress=address;
       var eth1_amount=1000000000000000000       
       eth_recv/=eth1_amount;
       tokens/=eth1_amount;
       var states=[ 'Issued', 'Active', 'Returned' ]
       var healthStates = ['Provisioning', 'Certified', 'Modified', 'Compromised', 'Malfunctioning', 'Harmful', 'Counterfeit' ]
       
       var infoObj={userAddress, address, balance, eth_recv, vault, state, health, tokens, isOwner, states, healthStates}

       self.setState({
           myAddress:userAddress,
           keyAddress:address,
           keyInfo: infoObj,
           loading:false, 
           showKeyInfo:true
       });    
   }

   
}  


page2 = (address) => {

   this.setState({myAddress: address, loading:true});
   web3Utils.get_keyAuth(address, this.page2_api) 

}




get_keyAuth_drizzle = (beneficiary, cb) => {
    var self=this;
    this.contracts = this.context.drizzle.contracts
    this.drizzleState=this.context.drizzle.store.getState()
    var smartNode="SmartKey";
        
    var amount=Math.round(parseFloat(amount)*eth1_amount);

    console.log(self.contracts);
    self.contracts[smartNode].methods.getSmartKey(beneficiary).call(
    {from: this.drizzleState.accounts[0]})
    .then(function(keyAddress)  {
        alert(keyAddress);
        if (keyAddress != '0x0000000000000000000000000000000000000000') {
            self.get_keyInfo(keyAddress);
        } else {
                    console.log("Key not found");
                    cb(beneficiary, '', '');
        }

    }).catch(function(error) {
        self.setState({loading:false})            
        alert("Could not complete transaction")
        alert(error);
        console.log(error);
        cb(beneficiary, '', '');
    });
}


createApiKey = () => {
    var self=this;
    self.setState({loading:true});
    self.hidePage1();

    var username=$('#username').val();
    var password=$('#password').val();
    var auth_key=this.state.myAddress + ":" + username + ":" + password;
    var auth_key=auth_key.toLowerCase();
    var myAddress=this.state.myAddress.toLowerCase();
    
    
    web3Utils.add_keyAuth(myAddress, myAddress, auth_key,  self.page2_api);         

}



  createSmartKey = () => {
    var self=this;
    var whitelist=[];
    var admins=[];
    var has_whitelist=false;

    
    var eth1=1000000000000000000;
    
    var beneficiary=$('#address').val();
    function key_created(address) {
        var myAddress=beneficiary;
        var keyAddress=address;
        
        
        setTimeout(() => { 
            self.page2(myAddress) 
        }, 3000)
    }
    this.setState({loading:true});
    self.hidePage1();
    
    web3Utils.add_smartkey(beneficiary,key_created); 

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
        self.page2(address);
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
  componentWillReceiveProps(newProps) {
      var self=this;
      if (newProps.init_address && newProps.init_address != this.init_address) {
        self.get_smart_key_info(this.props.init_address);

      }
  }
  render() {
    return(
      
        <div id={"keypage"}>
            {this.state.loading ? 
                (
                        <div>
                             <div className={"row"}>
                                <div className={"col-md-12 col-sm-12 col-xs-12"}>
                                    <span className={"middle"}>
                                    <center><img src={"images/wait.gif"} style={{width:"100%"}} /></center>
                                    </span>
                                </div>
                            </div>
                        </div>
                ) : this.state.showKeyInfo ? this.props.isNode ? (
                    <div>
                    <NodeKeyInfo keyInfo={this.state.keyInfo} 
                    myAddress={this.state.myAddress} 
                    add_auth={this.add_auth} 
                    showPage2_api={this.showPage2_api}
                    fill_page2={this.fill_page2} />
                </div>
                ) :
                (
                        <div>
                            <KeyInfo keyInfo={this.state.keyInfo} 
                            myAddress={this.state.myAddress} 
                            add_auth={this.add_auth} 
                            showPage2_api={this.showPage2_api}
                            fill_page2={this.fill_page2} />
                        </div>
                ) : null
            }
        </div>
    )
  }
}



Key.contextTypes = {
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
  
  
  
  
export default connect( stateToProps, dispatchToProps)( drizzleConnect(Key,drizzleStateToProps, drizzleDispatchToProps))
