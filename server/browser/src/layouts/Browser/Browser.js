import '../../App.css';
import React, { Component } from 'react';
import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import BrowserKeyInfo from "./BrowserKeyInfo";
import BrowserMapInfo from "./BrowserMapInfo";
import * as web3Utils from "../../util/web3/web3Utils";
var $ = require ('jquery');



const stateToProps = state => {
    return {
      
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
    };
};

@connect(stateToProps, dispatchToProps)
export default class Browser extends Component {
    static propTypes = {
        showDialog:PropTypes.func.isRequired,
        closeDialog:PropTypes.func.isRequired,
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

  
fill_api_info = (auth, auth_info) => {

    if (auth_info.length < 1)    {
        auth="Please Generate API Key <a href='key.html'>Here</a>";
        window.location.href='key.html';
    }
        
    $('.auth').html(auth);
    this.setState({
        loading:false,
        api_key:auth_info,
        api_auth:auth
    });
        
}


add_item= (id) => {
    var url = $('#browse_url').val() + '/<catalogue_name>';
                
    var html='<div className={"input-group"}>';
    html+='<span><h3>URL:</h3></span><input className={"form-control"} type=text id={"new_url"} value="' + url + '">';
    //html+='<input className={"form-control"} type=text id="' + id + '_val" value="' + val + '">';
    html+='<div className={"input-group-append"}><button className={"btn btn-primary"} type="button" ';
    html+=' onClick="JavaScript:save_item(\'' + id + '\')">Save</button></div>';
    html+='</div>';
    $('#' + id).html(html);
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

save_item = (id) => {
        var self=this;
        var user_item=this.state.user_item;
        var parent_address = $('#browse_url').val();
        var url = $('#new_url').val();
        var html='<img src="images/wait.gif"  width=100>';
        $('#' + id).html(html);
   
        
        $.ajax({
            beforeSend: function(xhr){
                self.add_auth(xhr);
                //setHeaders(xhr);
            
            },
            type: 'GET',
            url: '/cat/post?parent_href=' + encodeURIComponent(parent_address) + '&href=' + encodeURIComponent(url),
            data: JSON.stringify(user_item),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(body, textStatus, xhr) {
                self.browse($('#browse_url').val(), function() {
                    console.log('browse complete');
                });

            },
            error: function(xhr, textStatus, err) {
                console.log(xhr.status + ' ' + xhr.statusText);
            }
        });
}

add_meta = (id, node_href, item_href) => {
    var rel='urn:X-hypercat:rels:hasDescription:en';
    var val='';
    var html='<div className={"input-group"}>';
    html+='<input className={"form-control"} type=text id="' + id + '_rel" value="' + rel + '"><span style="vertical-align:middle;"><h1> = </h1></span>';
    html+='<input className={"form-control"} type=text id="' + id + '_val" value="' + val + '">';
    html+='<div className={"input-group-append"}><button className={"btn btn-primary"} type="button" ';
    html+=' onClick="JavaScript:save_meta(\'' + id + '\',\'' + node_href + '\',\'' + item_href + '\')">Save</button></div>';
    html+='</div>';
    $('#' + id).html(html);

}

edit_meta = (id, idx, data, node_href, item_href) => {
    var html='<div className={"input-group"}>';
    html+='<input className={"form-control"} type=text id="' + id + '_rel" value="' + data[idx]['rel'] + '"><span style="vertical-align:middle;"><h1> = </h1></span>';
    html+='<input className={"form-control"} type=text id="' + id + '_val" value="' + data[idx]['val'] + '">';
    html+='<div className={"input-group-append"}><button className={"btn btn-primary"} type="button" ';
    html+=' onClick="JavaScript:save_meta(\'' + id + '\',\'' + node_href + '\',\'' + item_href + '\')">Save</button></div>';
    html+='</div>';
    $('#' + id).html(html);

}

save_meta = (id, node_href, item_href) =>  {
        var self=this;
        var key='';
        var rel = $('#' + id + '_rel').val();
        var val = $('#' + id + '_val').val();
        
        var post_url='/cat/postNodeMetaData?href=' + encodeURIComponent(node_href);
        
        if (item_href) {
            post_url='/cat/postNodeItemMetaData?parent_href=' + encodeURIComponent(node_href) + '&href=' + encodeURIComponent(item_href);
        }
        
        //console.log(post_url, rel, val);
        post_url+='&rel=' + encodeURIComponent(rel);
        post_url+='&val=' + encodeURIComponent(val);
        post_url+='&key=' + encodeURIComponent(key);
        //alert(post_url);
        $.ajax({
            beforeSend: function(xhr){
                self.add_auth(xhr);
                    //setHeaders(xhr);
            },
            type: 'GET',
            url: post_url,
            //data: JSON.stringify(user_item),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(body, textStatus, xhr) {
                self.browse($('#browse_url').val(), function() {
                    console.log('browse complete');
                });
            },
            error: function(xhr, textStatus, err) {
                console.log(xhr.status + ' ' + xhr.statusText);
            }
        });

    //alert(id);  
}



save_location=(node_href, lat, lng) => {
       var self=this;
       $('#location_save_loading').show();
       $('#location_map').hide();
        var key='';
                
        var post_url='/cat/postNodeMetaData?href=' + encodeURIComponent(node_href);
        
        var lat_rel="http://www.w3.org/2003/01/geo/wgs84_pos#lat"
        var lng_rel="http://www.w3.org/2003/01/geo/wgs84_pos#long"
        
        var lat_url= post_url + '&rel=' + encodeURIComponent(lat_rel);
        lat_url+='&val=' + encodeURIComponent(lat);
        lat_url+='&key=' + encodeURIComponent(key);
        
        var lng_url= post_url + '&rel=' + encodeURIComponent(lng_rel);
        lng_url+='&val=' + encodeURIComponent(lng);
        lng_url+='&key=' + encodeURIComponent(key);
        //alert(post_url);
        $.ajax({
            beforeSend: function(xhr){
                    self.add_auth(xhr);
                    //setHeaders(xhr);
            },   
            type: 'GET',
            url: lat_url,
            //data: JSON.stringify(user_item),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(body, textStatus, xhr) {
                $.ajax({
                    beforeSend: function(xhr){
                        self.add_auth(xhr);
                                        //setHeaders(xhr);
                                },                    
                    type: 'GET',
                    url: lng_url,
                    //data: JSON.stringify(user_item),
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    success: function(body, textStatus, xhr) {
                        self.browse($('#browse_url').val(), function() {
                            console.log('browse complete');
                        });
                    },
                    error: function(xhr, textStatus, err) {
                        console.log(xhr.status + ' ' + xhr.statusText);
                    }
                });
            },
            error: function(xhr, textStatus, err) {
                console.log(xhr.status + ' ' + xhr.statusText);
            }
        });

    //alert(id);  
}

/*
deleteCat = (cat_url) => {
    del(cat_url, $('#key').val(), function(err) {
        if (!err) {
            // go back
            if (history.length > 1) {
                history.pop();  // throw away top
                url = history.pop();
                browse(url, function() {
                    log('browse complete');
                });
            }
        }
    });
}

deleteItem = (cat_url, item_url)  => {
    var url = cat_url + "?href=" + encodeURIComponent(item_url);
    del(url, $('#key').val(), function(err) {
        if (!err) {
            browse($('#url').val(), function() {
                log('browse complete');
            });
        }
    });
}
*/

browseCatalogue = () => {
    var self=this;
    self.browse($('#browse_url').val(), function() {
    });
}

parseCatalogue = (url, doc) => {
    var self=this;
    var catMetadataListHTML = '<ul>';
    var catalogue_meta_data=[]
    var map_json={};
    var catalogue_item_meta_data=[];

    var count=0;
    //try {
    // store metadata for catalogue
    console.log('Received Document')
    console.log(doc);
    var eth1_amount=1000000000000000000;
    for (var i=0;i<doc['catalogue-metadata'].length;i++) {
        var bal=parseFloat(doc['catalogue-metadata'][i].bal)/eth1_amount;
        //alert(doc['catalogue-metadata'][i]);
        catMetadataListHTML += '<li id=catalogue_meta_' + count + '>';
        catMetadataListHTML += '[ <a href="JavaScript:edit_meta(\'catalogue_meta_' + count + '\', ' + count + ', catalogue_meta_data, \'' + url + '\',\'\')"> Edit </a> ] ';
        catMetadataListHTML += doc['catalogue-metadata'][i].rel + ' = "' + doc['catalogue-metadata'][i].val + '"'
        catMetadataListHTML += '<br/><b>Donation Received: ' + bal + ' ETH ' + '</b> ' + '<br/><br/></li>';
        
        catalogue_meta_data.push({ 'rel':doc['catalogue-metadata'][i].rel, 'val':doc['catalogue-metadata'][i].val});
        if (doc['catalogue-metadata'][i].rel == "http://www.w3.org/2003/01/geo/wgs84_pos#lat") {
            map_json["Latitude"]=doc['catalogue-metadata'][i].val;
        }
        if (doc['catalogue-metadata'][i].rel == "http://www.w3.org/2003/01/geo/wgs84_pos#long") {
            map_json["Longitude"]=doc['catalogue-metadata'][i].val;
        }
        count+=1;
    }
    var addItemMetaData = ' [<a href="JavaScript:add_meta(\'catalogue_create_meta_data\',\'' + url + '\',\'\')">Add Meta Data</a>] <br/><br/>';

    var maplink='[ <a href="JavaScript:getMap();">Edit Location</a> ]<br/><br/>';
    
    catMetadataListHTML += '<li id=catalogue_create_meta_data>' + addItemMetaData + '</li>';

    catMetadataListHTML += '<li id=catalogue_get_location>' + maplink + '</li>';
        
    //} catch(e) {
    //    log(e);
    //}
    catMetadataListHTML += '</ul>';

    var urls=[url];
    var itemListHTML = '<ul>';

    count=0;
    //try {
        for (var i=0;i<doc.items.length;i++) {
            var item = doc.items[i];
            item.href = item.href.toString(); //URI(item.href).absoluteTo(url).toString();    // fixup relative URL
            urls.push(item.href);
            var isCat = false;
            var isGenericResource = false;
            var itemMetadataListHTML = '<ul>';
            var supportsQueryOpenIoT = false;
            for (var j=0;j<item['item-metadata'].length;j++) {
                var mdata = item['item-metadata'][j];
                var bal=parseFloat(mdata.bal)/eth1_amount;
                if (mdata.rel == 'urn:X-tsbiot:rels:supports:query' && mdata.val == 'urn:X-tsbiot:query:openiot:v1')
                    supportsQueryOpenIoT = true;
                itemMetadataListHTML += '<li id=item_meta_' + count + '>' 
                itemMetadataListHTML += '[ <a href="JavaScript:edit_meta(\'item_meta_' + count + '\', ' + count + ', catalogue_item_meta_data, \'' + url + '\',\'' + item.href + '\')"> Edit </a> ] ' + mdata.rel + ' = "' + mdata.val + '"'
                itemMetadataListHTML += '<br/><b>Donation Received: ' + bal + ' ETH ' + '</b> ' + '<br/><br/></li>';
                if (mdata.rel == "urn:X-tsbiot:rels:isContentType" && mdata.val == "application/vnd.tsbiot.catalogue+json")
                    isCat = true;
                if (mdata.rel == "urn:X-tsbiot:rels:isContentType" && (mdata.val == "application/senml+json" || mdata.val == "CompositeContentType"))
                    isGenericResource = true;
                catalogue_item_meta_data.push({ 'rel':mdata.rel, 'val':mdata.val, 'bal':bal});
            
                count+=1;
            }
             var addItemMetaData = ' [<a href="JavaScript:add_meta(\'catalogue_create_meta_data_' + i + '\',\'' + url + '\',\'' + item.href  + '\')">Add Meta Data</a>] <br/><br/>';

            itemMetadataListHTML += '<li id="catalogue_create_meta_data_' + i + '">' + addItemMetaData + '</li>';
            itemMetadataListHTML += '</ul>';

            var link;
            isCat=true;

            if (isCat)
                link = ' <a href="javascript:browse(\''+item.href+'\', function(){})">'+item.href+'</a>';
            else
            if (isGenericResource)
                link = '<a href="resourceviewer.html?key='+encodeURIComponent($('#key').val())+'&url='+encodeURIComponent(item.href)+'" target="_blank">'+item.href+'</a>';
            else
                link = '<a href="'+item.href+'">'+item.href+'</a>';

            var editlink = '<a href="itemcreator.html?key='+encodeURIComponent($('#key').val())+'&cat_url='+encodeURIComponent(url)+'&href='+encodeURIComponent(item.href)+'" target="_blank"><strong>[edit item]</strong></a>';
            var deletelink = '<a href="javascript:deleteItem(\''+url+'\',\''+item.href+'\');"><strong>[delete item]</strong></a>';

            
            itemListHTML += '<li>' + link + '<br/><br/></li>';
            itemListHTML += itemMetadataListHTML;
        }
        var addItemLink = '[<a href="JavaScript:add_item(\'add_catalogue_item\')"> Add Item </a>] ';
        itemListHTML += '<li id={"add_catalogue_item"}>' + addItemLink + '</li>';
        
        itemListHTML += '</ul>';

        var deletecatlink = '<a href="javascript:deleteCat(\''+url+'\');"><strong>[delete catalogue]</strong></a>';
        
        var listHTML = '<ul>';
        listHTML += '<li> Catalogue Metadata<br/><br/> </li>';
        listHTML += catMetadataListHTML;
        listHTML += '<li id={"showMap"} style="display:none"></li>'
        listHTML += '<li> Items <br/><br/> </li>'
        listHTML += itemListHTML;
        listHTML += '</ul>';

        self.populateUrls(urls);
        $('#browser').html(listHTML);
        this.setState({
            catalogue_meta_data,
            map_json,
            catalogue_item_meta_data});
            
    //} catch(e) {
    //    log(e);
    //}
}

browse(url, cb) {
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
                    var history=this.state.history;
                    history.push(url);
                    self.setState({history});
                    $('#browse_url').val(url);
                    self.parseCatalogue(url, doc);    // parse doc
                    self.get_smart_key_info(url);
                    cb(null); // done
                
            },
            error: function(xhr, textStatus, err) {
                console.log(xhr.status + ' ' + xhr.statusText);
            }
        });

}





refreshRaw = ()=> {
    $('#raw').val(JSON.stringify(this.state.user_item, undefined, 4));
}

populateMetaData =() => {
    var self=this;
    var user_item=this.state.user_item;
    var metadataHTML = '<ul>';
    for (var i=0;i<user_item['item-metadata'].length;i++) {
        var metadataItem = user_item['item-metadata'][i];
        var relHTML = '<input type="text" id="rel_'+i+'" size={40} value="'+metadataItem.rel+'"/>';
        var valHTML = '<input type="text" id="val_'+i+'" size={40} value="'+metadataItem.val+'"/>';
        var metadataItemHTML = relHTML + ' = ' + valHTML;
        var removeButtonHTML = '<input type="button" id="remove_'+i+'" value="X" />'
        metadataItemHTML += removeButtonHTML;
        var divHTML = '<div id="'+'div_'+i+'">' + metadataItemHTML + '</div>';
        metadataHTML += '<li>' + divHTML + '</li>';
    }
    metadataHTML += '</ul>';

    $('#metadata').html(metadataHTML);

    for (var i=0;i<user_item['item-metadata'].length;i++) {
        $('#remove_'+i).click(function() {
            var index = ($(this).attr('id').split('remove_'))[1];
            user_item['item-metadata'].splice(index, 1);
            self.refreshRaw();
            self.populateMetaData();
        });
        $('#rel_'+i).on('keyup', function (e) {
            var index = ($(this).attr('id').split('rel_'))[1];
            user_item['item-metadata'][index].rel = $(this).val();
            self.refreshRaw();
        });
        $('#val_'+i).on('keyup', function (e) {
            var index = ($(this).attr('id').split('val_'))[1];
            user_item['item-metadata'][index].val = $(this).val();
            self.refreshRaw();
        });
    }
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
    $("#urls").append(new Option(window.location.hostname + '/cat', window.location.hostname + '/cat'));

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

       var eth_salt = web3Utils.getCookie('iotcookie');
       if (eth_salt == null) {
            web3Utils.setCookie('iotcookie',new Date().toUTCString(),7);
            eth_salt = web3Utils.getCookie('iotcookie');
       }
       
   
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
       }
       web3Utils.init_wallet(eth_salt, check_key);

    
        self.populateUrls([]);
    
        self.populateMetaData();
        $('#add_metadata').click(function() {
            var user_item=self.state.user_item;
            user_item['item-metadata'].push({rel:"", val:""});
            self.setState({user_item, user_item});
            self.populateMetaData();
        });
    
        $('#urls').on('change', function (e) {
            var optionSelected = $("option:selected", this);
            var valueSelected = this.value;
            $('#browse_url').val(this.value);
            
            self.browse($('#browse_url').val(), function() {
                console.log('browse complete');
            });
            
        
        });
    
        $('#urls').trigger('change');
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
                        <label className={"title2"} style={{paddingTop:"5px"}}>Catalogue Browser & Editor</label>
                        <hr/>
                        </center>
                        <form className={"form-group"}>
                            <div className={"row"}>
                                <div className={"col-md-6"}>
                                    
                                    <label className={"title3"}>Select Catalogue:
                                    </label>
                                    <select id={"urls"} className={"form-control m-input m-input--air"} style={{height:"45px"}} ></select>
                                    
                                </div>
                                <div className={"col-md-6"}>
                                    
                                    <label className={"title3"}>Catalogue URL:
                                    </label>
                                    <div className={"input-group"}>
                                    <input className={"form-control m-input m-input--air"} style={{height:"45px"}} type={"text"} id={"browse_url"} 
                                        size={80} 
                                        value={window.location.hostname + "/cat"} />
                                        <div className={"input-group-append"}>
                                            <button className={"button3 btn btn-primary"} type="button" onClick="JavaScript:browseCatalogue();"><span className={"buttonText"}>Browse</span></button>
                                        </div>
                                    </div>
                                
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-md-6"} style={{textAlign:"left"}}>
                                    <br/>
                                    <label className={"title3"}>User SmartKey (Rinkeby Ethereum Network):
                                    </label>
                                    <span className={"auth"}></span>
                                    
                                </div>
                                <div className={"col-md-6"}>
                                    <br/>
                                    
                                    <label className={"title3"}>ETH Donation Per Transaction:
                                    </label>
                                    <div className={"input-group"}>
                                    <select id={"eth_contrib"} className={"form-control m-input m-input--air"} style={{height:"45px"}}>
                                        <option value='0.0001'>0.0001 ETH</option>
                                        <option value='0.001'>0.001 ETH</option>
                                        <option value='0.01'>0.01 ETH</option>
                                        <option value='0.1'>0.1 ETH</option>
                                        <option value='1'>1 ETH</option>
                                        
                                    </select>
                                        <div className={"input-group-append"}>
                                            <button className={"button3 btn btn-primary"} type="button" ><span className={"buttonText"}>Set Payment Terms</span></button>
                                        </div>
                                    </div>
                                    (Data update will reflect in catalogue after 1-2 minutes)
                                
                                </div>
                            </div>
                                <div className={"row"}>
                                    <div className={"col-md-12"}>
                                        <br/>
                                
                                        <br/>
                                        <div id={"browser"}></div>
                
                                    </div>
                                </div>
                            </form>
                
                        </div>
                    </div>
                
                <BrowserKeyInfo />
                <p>
                    <div id={"log"}></div>
                    <div className={"catalogue"}></div>
                </p>
                </div>   
            );
        }
  }
}

