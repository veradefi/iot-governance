import '../../App.css';
import React, { Component } from 'react';
import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import BrowserMapInfo from "./BrowserMapInfo";
import MetaData from "./MetaDataEOS";
import Catalogue from "./CatalogueEOS";
import * as web3Utils from "../../util/web3/web3Utils";
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
export default class View extends Component {
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
                        mode={'browse'} 
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
                        mode={'browse'}
                        browse={self.browse}
                        />

            })}
           
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
    
        //elf.populateUrls(urls);
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
                //self.add_auth(xhr);
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
                    self.setState({url:url})

                    cb(null); // done
                
            },
            error: function(xhr, textStatus, err) {
                console.log(xhr.status + ' ' + xhr.statusText)
            }
        });

}


    
log = (msg) => {
    var log = $('#log');
    log.append(msg + "<br/>\n");
    log.scrollTo('100%');
}


  componentDidMount() {
        var self=this;
        console.log("Loading Browser...")
       
        var check_key = () => {
           
           var url=self.props.location.url;
           var param= getParameterByName("url");
           if (param) {
               url=param;
           }
           if (!url) {
                url='https://iotblock.io/cat'
                window.location='/iotpedia/browser';
            }

           

           console.log(url); 
                                          
           self.browse(url, function() {
                console.log('browse complete');
                self.setState({
                    loading:false,
                    url:url,
                });
           });
            
        }
        check_key();

        /*
        var eth_salt = web3Utils.getCookie('iotcookie');
        if (eth_salt == null) {
                web3Utils.setCookie('iotcookie',new Date().toUTCString(),7);
                eth_salt = web3Utils.getCookie('iotcookie');
        }
        
        web3Utils.init_wallet(eth_salt, check_key);       
        */
    
    }    
  componentWillReceiveProps(newProps) {
    var self=this;
    if (newProps.location && newProps.location.url && newProps.location.url != this.props.location.url) {
        //alert("received prop")
        var check_key = () => {
            
            var url=newProps.location.url;
            if (!url) {
                url='https://iotblock.io/cat'
            }

            console.log(url); 
                                        
            self.browse(url, function() {
                console.log('browse complete');
                self.setState({
                    loading:false,
                    url:url,
                });
            });
            
        }
        check_key();
    }

  }
  render() {
    var self=this;
    if (this.state.loading) {
        return(
        
                            <div>
                                <div style={{width:"100%"}}>
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

            <div style={{width:"100%"}}>
                <div style={{width:"100%"}}>
                        <br/>
                        <center>
                        <label className={"title2"} style={{paddingTop:"5px"}}>
                         {self.state.url.replace("https://iotblock.io/cat/","")}
                        </label>
                        <hr/>
                        </center>
                </div>
            </div>
            <div style={{width:"100%"}}>
                <div style={{width:"100%"}}>
                    <br/>
            
                    <br/>
                    {self.state.catalogue_html ? 
                        self.state.catalogue_html
                        : null}
                    <div id={"browser"}></div>

                </div>
            </div>

        {this.state.url ? 
                <NodeKey isNode={true} url={this.state.url} />
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

