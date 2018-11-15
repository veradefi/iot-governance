import '../../App.css';
import React, { Component } from 'react';
import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import EditorMapInfo from "./EditorMapInfo";
import MetaData from "../Browser/MetaDataDAO";
import Catalogue from "../Browser/CatalogueDAO";
import * as web3Utils from "../../util/web3/web3Utils";
import * as APIUtils from "../../util/web3/APIUtils";

import Key from "../Key/Key"
import NodeKey from "../Key/NodeKey"
import { Link } from "react-router-dom";
var $ = require ('jquery');

const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  
const stateToProps = state => {
    return {
        user_key_address:state.auth.user_key_address,
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
        authSuccess: (api_auth, api_key, key_address) => {
            dispatch(actions.authSuccess(api_auth, api_key, key_address));
        },
        authEthContrib: (eth_contrib) => {
            dispatch(actions.authEthContrib(eth_contrib));
        },
    };
};



@connect(stateToProps, dispatchToProps)   
export default class Editor extends Component {
   static propTypes = {
        showDialog:PropTypes.func.isRequired,
        closeDialog:PropTypes.func.isRequired,
        user_key_address: PropTypes.string.isRequired,
        api_auth: PropTypes.string.isRequired,
        api_key: PropTypes.string.isRequired,
        eth_contrib: PropTypes.number.isRequired,
        isAuthenticated: PropTypes.bool.isRequired,
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
        loading:true,
        isSmartKey:false,
        isBrowse:false,
        isWeb:false,
        isPool:false,
        map_json:{},
        user_item : {
            "item-metadata":[
                {
                    "rel":"urn:X-hypercat:rels:hasDescription:en",
                    "val":"A catalogue"
                },
                {
                    "rel":"urn:X-hypercat:rels:isContentType",
                    "val":"application/vnd.tsbiot.catalogue+json"
                },
                {
                    "rel":"urn:X-hypercat:rels:supportsSearch",
                    "val":"urn:X-hypercat:search:simple"
                }
            ],
            "items": []
        },
        history:[],
        catalogue_meta_data:[],
        catalogue_item_meta_data:[],
        api_key:'',
        api_auth:'',
        transferAmt: 1,
        catalogue: 'https://iotblock.io/cat/StandardIndustrialClassification',
        catalogue_url: 'https://iotblock.io/cat/StandardIndustrialClassification',
        catalogue_selection: []
            

    };
    this._isMounted = false;
  }

proc_browse_data = (listHtml, doc, urls) => {
    var self=this;
    var history=self.state.history;
    history.concat(urls);
    self.populateUrls(urls);

    // $('#browser').html(listHTML);
    self.setState({
        history,
        loading:false,
        catalogue_html:listHtml,
        catalogue_meta_data:doc,
        //catalogue_url: orig_url,
        map_json:{},
        catalogue_item_meta_data:doc['item-metadata']});

    //self.get_smart_key_info(url);

    console.log('browse complete');
}

fill_api_info = (auth, auth_info, user_key_address) => {

    if (auth_info.length < 1)    {
        auth="Please Generate API Key <a href='key.html'>Here</a>";
        window.location.href='key.html';
    }
        
    //$('.auth').html(auth);
    this.setState({
        loading:false,
        api_key:auth_info,
        api_auth:auth
    });

    this.props.authSuccess(auth, auth_info, user_key_address);
    this.props.authEthContrib(parseFloat($('#eth_contrib').val()));
        
}



 log = (msg) => {
    var log = $('#log');
    log.append(msg + "<br/>\n");
    log.scrollTo('100%');
}


populateUrls = (urls) => {

    var self=this;
    var new_urls=urls.slice(0)
    new_urls.push(self.state.catalogue);
    var filter={};
    var final_urls=[];
    new_urls.map(item => {
        if (!filter[item])
            final_urls.push(item);
        filter[item]=true;
    })
    self.setState({catalogue_selection:final_urls});
    

}
  componentDidMount() {
        var self=this;
        console.log("Loading Editor...")
        /*
        var param_url = getQueryVariable('url');
        var param_key = getQueryVariable('key');
        if (param_key === undefined)
            param_key = "";
    
        $('#key').val(param_key);
        if (param_url !== undefined) {
            $('#browse_url').val(param_url);
        }
        */
           
        var check_key=(address) => {
           var url=self.state.catalogue;
            //url=url.replace(/\/$/, "");
           //url=url.replace(/icat/, "cat");
           //url="https://iotblock.io" + path
           
           var param= getParameterByName("url");
           if (param) {
               url=param;
               self.setState({catalogue_url:url})
           }
           console.log(url); 
           
           console.log('address' + address);
           $('.address').html(address);
           $('.address_val').val(address);
           


           web3Utils.get_keyAuth(address, self.fill_api_info) 

            
           this.setState({catalogue_url:url, loading:true});
           APIUtils.browse({api_key: self.props.api_key, api_auth:self.props.api_auth}, url, this.proc_browse_data);
            
        }
        var eth_salt = web3Utils.getCookie('iotcookie');
        if (eth_salt == null) {
                web3Utils.setCookie('iotcookie',new Date().toUTCString(),7);
                eth_salt = web3Utils.getCookie('iotcookie');
        }
        
        web3Utils.init_wallet(eth_salt, check_key);

      


    
    }    
    
  render() {
    var self=this;
    if (this.state.loading) {
        return(
        
                            <div>
                                <div className={"row"}>
                                    <div className={"col-md-12 col-sm-12 col-xs-12"}>
                                        <span className={"middle"}>
                                        <center><img src={"images/wait.gif"} style={{width:"100%"}} /></center>
                                        </span>
                                    </div>
                                </div>
                            </div>
        );
    } else {
        return (
            <div id={"page1"}>
                <div className={"row"}>
                <div className={"col-md-12"} >
                <form className={"form-group"}>
                   
                        <center>
                        <table>
                            <tbody>
                                <tr>
                                    <td style={{textAlign:"right"}}><label className={"title3"} style={{ fontSize: "12px" }} >Select Catalogue:
                                    </label>
                                    </td>
                                    <td> <select id={"urls"} onChange={(e) => {
                                                //self.setState({ catalogue_url:e.target.value});

                                                APIUtils.browse({api_key: self.props.api_key, api_auth:self.props.api_auth},
                                                    e.target.value, this.proc_browse_data);
                                                    
                                            

                                        }}
                                        value={self.state.catalogue_url}
                                        className={"form-control m-input m-input--air"} 
                                        style={{
                                            height:"45px",
                                            maxWidth:"88%"
                                            }} >
                                        {self.state.catalogue_selection.map(item => {
                                            
                                            return <option key={"item" + item} 
                                            value={item}>{item}</option>
                                        })}
                                       </select>
                                    
                                    </td>
                                </tr>
                               
                                <tr><td  style={{textAlign:"right"}}><label className={"title3"} style={{ fontSize: "12px" }} >Catalogue URL:
                                    </label>
                                    </td>
                                    <td> <div className={"input-group"}
                                    style={{

                                        maxWidth:"88%"

                                    }}
                                    >
                                    <textarea className={"form-control m-input m-input--air"} 
                                    style={{
                                        height:"45px",
                                    }} type={"text"} id={"browse_url"} 
                                        //size={80} 
                                        onChange={(e) => {
                                            self.setState({catalogue_url:e.target.value});
                                        }} value={self.state.catalogue_url}
                                        />
                                        
                                        <div className={"input-group-append"}>
                                            <button className={"button3 btn btn-primary"} type="button" 
                                            onClick={() => {
                                                APIUtils.browse({api_key: self.props.api_key, api_auth:self.props.api_auth},
                                                    self.state.catalogue_url, self.proc_browse_data);
           
                                            }
                                            } ><span className={"buttonText"}>Browse</span></button>
                                        </div>
                                    </div>
                                    </td>
                                </tr>
                                <tr><td  style={{textAlign:"right"}}><label className={"title3"} style={{ fontSize: "12px" }} >User SmartKey <br/>(Rinkeby Network):
                                    </label>
                                    </td>
                                    <td> <pre className={"auth"} 
                                    style={{
                                        whiteSpace: "pre-wrap",  
                                        maxWidth:"88%",
                                        marginBottom:"0px"}}>
                                    <Link to={{ 
                        pathname: '/key',
                    }}><b>{self.props.user_key_address}</b></Link>
                                    </pre>
                                    </td>
                                </tr>
                                {/*
                                <tr><td  style={{textAlign:"right"}}><label className={"title3"} style={{ fontSize: "12px" }} >ETH Donation:
                                    </label>
                                    </td>
                                    <td> <div className={"input-group"}
                                    style={{

                                        maxWidth:"88%"

                                    }}
                                    
                                    >
                                    <select id={"eth_contrib"} onChange={() => {
                                                self.props.authEthContrib(parseFloat($('#eth_contrib').val()));
                                    }}
                                    className={"form-control m-input m-input--air"} style={{height:"45px"}}>
                                        <option value='0.0001'>0.0001 ETH & Gas / Transaction</option>
                                        <option value='0.001'>0.001 ETH & Gas / Transaction</option>
                                        <option value='0.01'>0.01 ETH & Gas / Transaction</option>
                                        <option value='0.1'>0.1 ETH & Gas / Transaction</option>
                                        <option value='1'>1 ETH & Gas / Transaction</option>
                                        
                                    </select>
                                        <div className={"input-group-append"}>
                                            <button className={"button3 btn btn-primary"} 
                                            type={"button"}
                                            onClick={() => {
                                                self.props.authEthContrib(parseFloat($('#eth_contrib').val()));


                                            }} ><span className={"buttonText"}>Set Terms</span></button>
                                        </div>
                                    </div>
                                    (Data update will reflect in catalogue after 1-2 minutes)
                                    </td>
                                </tr>
                                        */}
                            </tbody>
                        </table>
                        </center>
                        <hr/>

                                <div className={"row"}>
                                    <div className={"col-md-12"}>
                                        <br/>
                                
                                        <br/>
                                        {self.state.catalogue_html ? 
                                            self.state.catalogue_html
                                            : null}
                                        <div id={"browser"}></div>
                
                                    </div>
                                </div>
                            </form>
                
                        </div>
                    </div>
                    {}
                    {self.state.catalogue_url ? 
                <NodeKey isNode={true} url={this.state.catalogue_url} />
                    : null}
                <div>
                    <div id={"log"}></div>
                    <div className={"catalogue"}></div>
                </div>
                </div>   
            );
        }
  }
}

