import '../../App.css';
import React, { Component } from 'react';
import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import BrowserKeyInfo from "./BrowserKeyInfo";
import BrowserMapInfo from "./BrowserMapInfo";
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
        
    var listHTML = (
        <ul>
            <li> Search Result: 
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

search = () => {
    var self=this;
    if (!self.state.search)
        return;
    var history=[];
        
    //alert(url);
    var fetch_location='/cat/?q=' + self.state.search;

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
        self.setState({loading:false});
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
                        <label className={"title2"} style={{paddingTop:"5px"}}>IoTPedia </label>
                        <hr/>
                        </center>
                        <form className={"form-group"}>
                            <div className={"row"}  style={{padding:"15px"}}>
                                <div className={"col-md-12"}>
                                    
                                    <center>
                                    <div className={"input-group"}>
                                        <input  className={"form-control m-input m-input--air"} 
                                                style={{height:"45px"}} 
                                                type={"text"} 
                                                id={"search"} 
                                                size={80} 
                                                defaultValue={''}
                                                placeholder={'Search Catalogue...'} 
                                                onChange={(e) => {
                                                    console.log(e.target.value);
                                                    self.setState({search:e.target.value})
                                                }}
                                            />
                                            <button className={"button3 btn btn-primary"} 
                                            type={"button"}
                                            onClick={() => {
                                                self.search();


                                            }} ><span className={"buttonText"}>Search</span></button>
                                    </div>
                                    <div className={"input-group-append"}>
                                    </div>

                                    </center> 
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
                </div>   
            );
        }
  }
}

