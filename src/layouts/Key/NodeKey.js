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
var $ = require ('jquery');



const stateToProps = state => {
    return {
        api_auth: state.auth.api_auth,
        api_key: state.auth.api_key,
        eth_contrib: state.auth.eth_contrib,
        isAuthenticated: state.auth.isAuthenticated
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



@connect(stateToProps, dispatchToProps)
export default class NodeKey extends Component {
    static propTypes = {
        showDialog:PropTypes.func.isRequired,
        closeDialog:PropTypes.func.isRequired,
        api_auth: PropTypes.string.isRequired,
        api_key: PropTypes.string.isRequired,
        eth_contrib: PropTypes.number.isRequired,
        isAuthenticated: PropTypes.bool.isRequired,
        init_address:PropTypes.string,
        isNode:PropTypes.bool,
        url:PropTypes.string.isRequired
    };
  
  /**
   * Creates an instance of OrderDialog.
   * @constructor
   * @param {any} props
   * @memberof OrderDialog
   */

  constructor(props) {
    super(props);

    this.state = {
        isSmartKey:true,
        myAddress:props.isNode && props.init_address ? props.init_address : '0x0',
        keyAddress:props.isNode && props.init_address ? props.init_address : '0x0',
        health_init:false,
        loading:true,
        url:props.url

    };
    this._isMounted = false;
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
  
 


get_smart_key_info = (node_url="") => {

    var self=this;
    var href=this.state.url;
    if (node_url)
        href=node_url;

    $.ajax({
            beforeSend: function(xhr){
                self.add_auth(xhr);
                //setHeaders(xhr);
            
            },
            type: 'GET',
            url: '/cat/getNodeSmartKey?href=' + encodeURIComponent(href),
            //data: JSON.stringify(user_item),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(body, textStatus, xhr) {
                body.href=href;
                var eth1_amount=1000000000000000000       
                /*var myAddress=userAddress;
                var keyAddress=address;
                */
                body.keyAddress=body.address;
                body.balance/=eth1_amount;
                body.eth_recv/=eth1_amount;
                body.tokens/=eth1_amount;
                body.url=href;
               
                var states=[ 'Issued', 'Active', 'Returned' ]
                var healthStates = ['Provisioning', 'Certified', 'Modified', 'Compromised', 'Malfunctioning', 'Harmful', 'Counterfeit' ]
                
                body.states=states;
                body.healthStates=healthStates;
                //{userAddress, address, balance, eth_recv, vault, state, health, tokens, isOwner, states, healthStates}
                self.setState({keyInfo:body, key_address:body.address, myAddress:body.address, loading:false});
                console.log("Node Key Info for " + href);
                console.log(body);
            },
            error: function(xhr, textStatus, err) {
                console.log(xhr.status + ' ' + xhr.statusText);
            }
        });
}



  getKeyStatus = () => {
    var self=this;
      
    var eth_salt = web3Utils.getCookie('iotcookie');
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
        self.get_smart_key_info(this.props.url);

  }
  componentWillReceiveProps(newProps) {
      var self=this;
      if (newProps.url && this.props.url != newProps.url) {
          this.setState({url:newProps.url})
          self.get_smart_key_info(newProps.url);
          
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
                ) :  
                    <div>
                    <NodeKeyInfo keyInfo={this.state.keyInfo} 
                    myAddress={this.state.myAddress} 
                    add_auth={this.add_auth} 
                    get_smart_key_info={this.get_smart_key_info}
                     />
                </div>
            }
        </div>
    )
  }
}

