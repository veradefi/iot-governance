import '../../App.css';
import React, { Component } from 'react';
import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import EditorKeyInfo from "./EditorKeyInfo";
import EditorMapInfo from "./EditorMapInfo";
import MetaData from "./MetaData";
import Catalogue from "./Catalogue";
import * as web3Utils from "../../util/web3/web3Utils";
import Key from "../Key/Key"
var $ = require ('jquery');


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

            

    };
    this._isMounted = false;
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




add_auth = (xhr) => {
        var eth1=1000000000000000000;
        var eth_contrib=parseFloat($('#eth_contrib').val()) * eth1;
        var data="Token api_key=\"" + this.state.api_key + "\" auth=\"" + this.state.api_auth + "\" eth_contrib=\"" + eth_contrib + "\"";
        data=btoa(data);
        data=btoa(data + ':' + '');
        xhr.setRequestHeader("Accept","application/vvv.website+json;version=1");
        xhr.setRequestHeader("Authorization", data); 

}


browseCatalogue = () => {
    var self=this;
    self.browse($('#browse_url').val(), function() {
    });
}


parseCatalogue = (url, doc) => {
    var self=this;
    
    var catalogue_meta_data=[]
    var map_json={};
    var catalogue_item_meta_data=[];

    var count=0;
    //try {
    // store metadata for catalogue
    console.log('Received Document')
    console.log(doc);
    var eth1_amount=1000000000000000000;
    doc.id="catalogue";
    doc.href=url;
    var catMetadataListHTML = (
        <ul>

            <Catalogue  key={doc.id} 
                        catalogueType={'catalogue-metadata'} 
                        idata={doc} 
                        mode={'view'} 
                        browse={self.browse} />
        
        </ul>    
    );
        
    

    var urls=[url];
    count=0;
    var i=0;
    var itemListHTML = (
        <ul>
        
            {doc.items.map(item => {
                urls.push(item.href);
                item.id='item_' + i;
                item.node_href=url;
                i+=1;
                return <Catalogue 
                        key={item.id}
                        catalogueType={'item-metadata'}
                        idata={item}
                        mode={'view'}
                        browse={self.browse}
                        />

            })}
            <Catalogue 
                catalogueType={'item-metadata'}
                showAddItem={true}
                idata={{
                    
                    id:'add_catalogue_item',
                    node_href:url,
                    href:'',
                    items:[],            
                    
                }}
                mode={'add'} 
                browse={self.browse} />
        </ul>
    );
        
    var listHTML = (
        <ul><li> Catalogue Metadata
                <br/><br/> 
            </li>
            {catMetadataListHTML}
            <li id={"showMap"} style={{display:"none"}}></li>
            <li> Items 
                <br/><br/> 
            </li>
            {itemListHTML}
        </ul>
        );
    
        self.populateUrls(urls);
        // $('#browser').html(listHTML);
        this.setState({
            catalogue_html:listHTML,
            catalogue_meta_data:doc,
            map_json,
            catalogue_item_meta_data:doc['item-metadata']});
            
    //} catch(e) {
    //    log(e);
    //}
}

browse = (url, cb) => {
    var self=this;
    var history=[];
        
    //alert(url);
    var fetch_location='/cat/getBalance?href=' + url;

    $.ajax({
            beforeSend: function(xhr){
                self.add_auth(xhr);
                //setHeaders(xhr);
            
            },
            type: 'GET',
            url: fetch_location,
            //data: JSON.stringify(user_item),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(doc, textStatus, xhr) {
                    var history=self.state.history;
                    history.push(url);
                    self.setState({history});
                    $('#browse_url').val(url);
                    self.parseCatalogue(url, doc);
                    self.get_smart_key_info(url);

                    cb(null); // done
                
            },
            error: function(xhr, textStatus, err) {
                console.log(xhr.status + ' ' + xhr.statusText)
            }
        });

}


    
get_smart_key_info = (href) => {

    var self=this;
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
                self.setState({keyInfo:body, key_address:body.address});
                
                //self.fill_page2(href, body["address"], body["balance"], body["eth_recv"], body["vault"], body["state"], body["health"], body["isOwner"]);
            },
            error: function(xhr, textStatus, err) {
                console.log(xhr.status + ' ' + xhr.statusText);
            }
        });
}






 log = (msg) => {
    var log = $('#log');
    log.append(msg + "<br/>\n");
    log.scrollTo('100%');
}


populateUrls = (urls) => {

    $("#urls").find('option').remove().end();
    
    for (var i=0; i < urls.length; i++) {
        $("#urls").append(new Option(urls[i], urls[i]));
    }
    $("#urls").append(new Option('https://iotblock.io' + '/cat', 'https://iotblock.io' + '/cat'));

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
        var check_key=function(address) {
           var url='https://iotblock.io/cat';
           var path='/cat';
           url=url.replace(/\/$/, "");
           url=url.replace(/icat/, "cat");
           url="https://iotblock.io" + path
           path=path.replace(/\/$/, "");
           path=path.replace(/icat/, "cat");
           
           console.log(url); 
           console.log(path)
           
           console.log('address' + address);
           $('.address').html(address);
           $('.address_val').val(address);
           


           web3Utils.get_keyAuth(address, self.fill_api_info) 

            $('#browse_url').val('https://iotblock.io/cat');
            
            self.browse('https://iotblock.io/cat', function() {

                    console.log('browse complete');
                
            

            });
            
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
                <div className={"col-md-12"}>
                        <br/>
                        <center>
                        <label className={"title2"} style={{paddingTop:"5px"}}>Catalogue Editor & Editor</label>
                        <hr/>
                        </center>
                        <form className={"form-group"}>
                            <div className={"row"}  style={{padding:"15px"}}>
                                <div className={"col-md-6"}>
                                    
                                    <label className={"title3"}>Select Catalogue:
                                    </label>
                                    <select id={"urls"} onChange={() => {
                                                
                                                $('#browse_url').val($('#urls').val());
                                                
                                                self.browse($('#browse_url').val(), function() {
                                                    console.log('browse complete');
                                                });
                                                
                                        

                                    }}
                                    className={"form-control m-input m-input--air"} style={{height:"45px"}} ></select>
                                    
                                </div>
                                <div className={"col-md-6"}>
                                    
                                    <label className={"title3"}>Catalogue URL:
                                    </label>
                                    <div className={"input-group"}>
                                    <input className={"form-control m-input m-input--air"} style={{height:"45px"}} type={"text"} id={"browse_url"} 
                                        size={80} 
                                        defaultValue={'https://iotblock.io' + "/cat"} />
                                        <div className={"input-group-append"}>
                                            <button className={"button3 btn btn-primary"} type="button" 
                                            onClick={() => {
                                                self.browseCatalogue();

                                            }
                                            } ><span className={"buttonText"}>Browse</span></button>
                                        </div>
                                    </div>
                                
                                </div>
                            </div>
                            <div className={"row"} style={{padding:"15px"}}>
                                <div className={"col-md-6"} style={{textAlign:"left"}}>
                                    <br/>
                                    <label className={"title3"}>User SmartKey (Rinkeby Ethereum Network):
                                    </label>
                                    <span className={"auth"}>
                                    <a href='/key'><b>{self.props.user_key_address}</b></a>
                                    </span>
                                    
                                </div>
                                <div className={"col-md-6"}>
                                    <br/>
                                    
                                    <label className={"title3"}>ETH Donation Per Transaction:
                                    </label>
                                    <div className={"input-group"}>
                                    <select id={"eth_contrib"} onChange={() => {
                                                self.props.authEthContrib(parseFloat($('#eth_contrib').val()));
                                    }}
                                    className={"form-control m-input m-input--air"} style={{height:"45px"}}>
                                        <option value='0.0001'>0.0001 ETH</option>
                                        <option value='0.001'>0.001 ETH</option>
                                        <option value='0.01'>0.01 ETH</option>
                                        <option value='0.1'>0.1 ETH</option>
                                        <option value='1'>1 ETH</option>
                                        
                                    </select>
                                        <div className={"input-group-append"}>
                                            <button className={"button3 btn btn-primary"} 
                                            type={"button"}
                                            onClick={() => {
                                                self.props.authEthContrib(parseFloat($('#eth_contrib').val()));


                                            }} ><span className={"buttonText"}>Set Payment Terms</span></button>
                                        </div>
                                    </div>
                                    (Data update will reflect in catalogue after 1-2 minutes)
                                
                                </div>
                            </div>
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
                    {self.state.key_address ? 
                <Key init_address={self.state.key_address} />
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

