import React, { Component } from 'react'

import MetaData from "../../layouts/Browser/MetaDataEOS";
import Catalogue from "../../layouts/Browser/CatalogueEOS";

var $ = require ('jquery');
var axios=require("axios");

var tableURL="https://iotblock.io/eos/v1/chain/get_table_rows"



export const getCat = () => {
    var data = JSON.stringify({
        "scope": "catalogue",
        "code": "catalogue",
        "table": "catdata3",
        "json": "true"
      });
    
      axios.post(tableURL, data)
      .then(function (response) {
    
          var jsonText=response.data;
          //console.log(jsonText)
          var hrefToId={}
          jsonText.rows.map(item => {
            hrefToId[item.href]=item;
          })
          //console.log(hrefToId)
          getMeta(hrefToId);
      }).catch(function (error) {
        console.log(error);
      });
  }
  
  export const getMeta = (cb) => {
    var data2 = JSON.stringify({
        "scope": "catalogue",
        "code": "catalogue",
        "table": "metadata3",
        "json": "true"
      });
      axios.post(tableURL, data2)
      .then(function (response) {
        //console.log(response);
        var jsonText=response.data;
          //console.log(jsonText)
          var hrefToId={}
          jsonText.rows.map(item => {
            if (!(item.hrefName in hrefToId)) {
              hrefToId[item.hrefName]=[];
            }
            hrefToId[item.hrefName].push({ 'rel': item.rel, 'val' : item.val});
          })
          //console.log(hrefToId)
          getgraph(hrefToId, cb);
        
      }).catch(function (error) {
        console.log(error);
      });
  }
  
  export const getgraph = (metaData, cb) => {
    var data2 = JSON.stringify({
      "scope": "catalogue",
      "code": "catalogue",
      "table": "graphdata3",
      "json": "true"
    });
    
      axios.post(tableURL, data2)
      .then(function (response) {
        //console.log(response);
        var jsonText=response.data;
        var hrefToId={}
          var rootHref=''
          jsonText.rows.map(item => {
            if (!(item.hrefName in hrefToId)) {
              hrefToId[item.hrefName]=[]
            }
            if (!rootHref) {
              rootHref=item.hrefName;
            }
    
            hrefToId[item.hrefName].push(item.hrefName2)
          })
          //console.log(hrefToId)
          
          var cat={};
          cat.href=rootHref;
          cat["catalogue-metadata"]=metaData[rootHref];
          cat["items"]=hrefToId[rootHref].map(item => {
            return { href:item, 
                     "catalogue-metadata" : metaData[item], 
                     "items": item in hrefToId ? hrefToId[item].map(item2 => {
                       return { href:item2, 
                                "catalogue-metadata": metaData[item2]}
                     }) : [] }
          });
    
          cb(cat);
        
      }).catch(function (error) {
        console.log(error);
      });
  }

  
export const add_auth = (auth, xhr) => {
    var eth1=1000000000000000000;
    var eth_contrib=0 * eth1;
    var data="Token api_key=\"" + auth.api_key + "\" auth=\"" + auth.api_auth + "\" eth_contrib=\"" + eth_contrib + "\"";
    data=btoa(data);
    data=btoa(data + ':' + '');
    xhr.setRequestHeader("Accept","application/vvv.website+json;version=1");
    xhr.setRequestHeader("Authorization", data); 

}

export const parseCatalogue = (url, doc, cb) => {
    var self=this;
    var orig_url;
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
    doc.node_href=url;
    var catMetadataListHTML = <Catalogue  key={Math.random()} 
                        catalogueType={'catalogue-metadata'} 
                        idata={Object.assign({}, doc)} 
                        mode={'view'} 
                        browse={browse} />
        


    var urls=[url];
    count=0;
    var i=0;
    var itemListHTML=doc.items.map(item => {
                urls.push(item.href);
                item.id='item_' + i;
                item.node_href=url;
                i+=1;
                return <Catalogue 
                        key={Math.random()}
                        catalogueType={'item-metadata'}
                        idata={item}
                        mode={'view'}
                        browse={browse}
                    
                        />

            })
    var addItem=<Catalogue 
                key={Math.random()}
                catalogueType={'item-metadata'}
                showAddItem={true}
                idata={{
                    address: doc.address,
                    id:'add_catalogue_item',
                    node_href:url,
                    href:'',
                    items:[],            
                    
                }}
                mode={'add'} 
                browse={browse} />;
        
    var listHTML = (
        <div><b>Catalogue Metadata</b>
                <br/><br/> 
            <div style={{
                        display: "flex",
                        flexFlow: "row wrap",
                        alignItems: "stretch",
                        justifyContent: "space-around"
                    }}>





            {catMetadataListHTML}
            </div>
            <li id={"showMap"} style={{display:"none"}}></li>
            <b>Items</b>
            <div style={{
                        
                        display: "flex",
                        flexFlow: "wrap",
                        alignItems: "stretch",
                        
                        }}> 
            {itemListHTML}
            </div>
            {addItem}
        </div>
        );


        cb(listHTML, doc, urls);
            
    //} catch(e) {
    //    log(e);
    //}
}

export const browse = (auth, url, cb) => {
    var self=this;
    var history=[];
                    

    getMeta( (doc) => {
  
        console.log(doc);
        parseCatalogue(url, doc, function (listHtml, doc, urls) {
            cb(listHtml, doc, urls); //done
            
        });

    });

}


export const browseCatalogue = (auth, url, cb) => {
    var self=this;
    browse(auth, url, cb);
}
    

export const get_smart_key_info = (auth, href) => {

    var self=this;
    $.ajax({
            beforeSend: function(xhr){
                add_auth(auth, xhr);
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
