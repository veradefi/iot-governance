import '../../App.css';
import React, { Component } from 'react';
import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import BrowserMapInfo from "./BrowserMapInfo";
import MetaData from "./MetaDataDAO";
import Catalogue from "./CatalogueDAO";
import * as web3Utils from "../../util/web3/web3Utils";
import Key from "../Key/Key"
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
export default class Browser extends Component {
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
        catalogue:'https://iotblock.io/cat/StandardIndustrialClassification'

            

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
    this.props.authEthContrib(parseFloat("0.0001"));
        
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


parseCatalogue = (doc) => {
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
    doc.id="res";
    var url='/cat';
    doc.href=url;
    var catMetadataListHTML = (
        <ul>

            <Catalogue  
                key={doc.id} 
                catalogueType={'catalogue-metadata'} 
                idata={doc} 
                mode={'browse'} 
                browse={self.browse} 
            />
        
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
    if (doc.items.length < 1) {
        itemListHTML=<div>
            <center>
            <Catalogue 
                catalogueType={'catalogue-metadata'}
                showAddItem={true}
                showButton={true}
                itemName={this.state.search ? this.state.search : ''}
                idata={{
                    
                    id:'add_catalogue_item',
                    node_href:'https://iotblock.io/cat/StandardIndustrialClassification/BarCodes',
                    href: 'https://iotblock.io/cat/StandardIndustrialClassification/BarCodes/' + this.state.search,
                    items:[],          
                    "catalogue-metadata": [
                        {
                            "rel": "urn:X-hypercat:rels:isContentType",
                            "val": "application/vnd.hypercat.catalogue+json"
                        },
                        {
                            "rel": "urn:X-hypercat:rels:hasDescription:en",
                            "val": ""
                        },
                        {
                            "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#lat",
                            "val": "78.47609815628121"
                        },
                        {
                            "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#long",
                            "val": "-39.99203727636359"
                        },
                        {
                            "rel": "urn:X-hypercat:rels:Media:1",
                            "val": ""
                        }
                    ]
                    
                }}
                mode={'add'} 
                browse={() => {
                    window.location='/iotpedia/editor?url=https://iotblock.io/cat/StandardIndustrialClassification/BarCodes/' + this.state.search
                }} />
            <br/>
            <b>
                        <font color={"orange"}>{self.props.eth_contrib} ETH / Transaction</font>
                        </b>

               
            </center>
        </div>
    }
        
    var listHTML = (
        <ul>
            <li> {self.state.isCatalogue && !self.state.isSearch ? "Catalogue Index (UK SIC):" : "Search Result:"} 
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

initCatalogue = () => {
    var self=this;
    //if (!self.state.search)
    //    return;
    var history=[];
        
    //alert(url);
    var fetch_location=this.state.catalogue;
                    
    var param= getParameterByName("url");
    var q = getParameterByName("q");
    if (param) {
        fetch_location=param;
    }


    if (q) {
        this.setState({search:q, isCatalogue:false, isSearch:true});
        this.search(q);
    } else {

    $.ajax({
            //beforeSend: function(xhr){
            //self.add_auth(xhr);
                
            //},
            type: 'GET',
            url: fetch_location,
            //data: JSON.stringify(user_item),
            //contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(doc, textStatus, xhr) {
                    //var history=self.state.history;
                    self.setState({loading:false, isCatalogue:true, isSearch:false});
                    //history.push(url);
                    //self.setState({history});
                    //$('#browse_url').val(url);
                    self.parseCatalogue(doc);
                    
                    //self.get_smart_key_info(url);
                    //cb(null); // done                
            },
            error: function(xhr, textStatus, err) {
                console.log(xhr.status + ' ' + xhr.statusText)
            }
        });
    }

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

         
     }
     var eth_salt = web3Utils.getCookie('iotcookie');
     if (eth_salt == null) {
             web3Utils.setCookie('iotcookie',new Date().toUTCString(),7);
             eth_salt = web3Utils.getCookie('iotcookie');
     }
     
     web3Utils.init_wallet(eth_salt, check_key);


}
search = (q) => {
    var self=this;
    var search='';
    if (self.state.search)
        search=self.state.search;
    if (q) 
        search=q;
    if (!search)
        return;
    var history=[];
        
    //alert(url);
    var fetch_location='/cat/?q=' + search;

    this.setState({loading:true})
    $.ajax({
            beforeSend: function(xhr){
                //self.add_auth(xhr);
                
            },
            type: 'GET',
            url: fetch_location,
            //data: JSON.stringify(user_item),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(doc, textStatus, xhr) {
                    //var history=self.state.history;
                    //history.push(url);
                    self.setState({loading:false, isCatalogue:false, isSearch:true});
                    //$('#browse_url').val(url);
                    self.parseCatalogue(doc);
                    //self.get_smart_key_info(url);
                    //cb(null); // done                
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
    $("#urls").append(new Option(this.state.catalogue, this.state.catalogue));

}

componentDidMount() {
        var self=this;        
        self.initCatalogue();

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
                    <br/>
                    <div style={{width:"100%"}}>
                        <form className={"form-group"}>
                            <div style={{width:"100%"}}  style={{padding:"15px"}}>
                                <div style={{width:"100%"}}>
                                    
                                    <div className={"input-group"}>
                                        <input  className={"form-control m-input m-input--air"} 
                                                style={{height:"45px", maxWidth:"90%"}} 
                                                type={"text"} 
                                                id={"search"} 
                                                defaultValue={''}
                                                placeholder={'Search Catalogue...'} 
                                                onChange={(e) => {
                                                    console.log(e.target.value);
                                                    self.setState({search:e.target.value})
                                                }}
                                            />
                                            <button className={"button3 btn btn-primary"} 
                                            type={"button"}
                                            style={{ maxWidth:"100px"}}
                                            onClick={() => {
                                                self.search();


                                            }} ><span className={"buttonText"}>Search</span></button>
                                    </div>
                                </div>
                            </div>
                            </form>
                            
                                <div style={{width:"100%"}}>
                                    <div style={{width:"100%"}}>
                                        <br/>
                                
                                        {self.state.catalogue_html ? 
                                            self.state.catalogue_html
                                            : null}
                                        <div id={"browser"}></div>
                
                                    </div>
                                </div>

                        </div>
                    </div>
                </div>   
            );
        }
  }
}

