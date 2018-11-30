import React, { Component } from 'react'
import PropTypes from "prop-types";
import * as web3Utils from "../../util/web3/web3Utils";
import * as APIUtils from "../../util/web3/APIUtils";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import ContractDAO from '../../util/web3/ContractDAO'
import AccountDAO from '../../util/web3/AccountDAO'
import { drizzleConnect } from 'drizzle-react'
import NodeKey from "../Key/NodeKey"
import MetaData from "./MetaDataDAO"    
import ContractFormDAO from '../../util/web3/ContractFormDAO'
import { Link } from "react-router-dom";
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import {Button} from 'react-toolbox/lib/button';
var QRCode = require('qrcode.react');
var $ = require ('jquery');


//@connect(stateToProps, dispatchToProps)
class CatalogueDAO extends Component {
   static propTypes = {
        showDialog:PropTypes.func.isRequired,
        closeDialog:PropTypes.func.isRequired,
        api_auth: PropTypes.string.isRequired,
        api_key: PropTypes.string.isRequired,
        eth_contrib: PropTypes.number.isRequired,
        isAuthenticated: PropTypes.bool.isRequired,
        browse:PropTypes.func,
        showAddItem:PropTypes.bool,
        showButton:PropTypes.bool,
        showDeviceUI:PropTypes.bool,
        itemName:PropTypes.string,
  };
  
  constructor(props) {
    super(props)
    this.state={
        loading:false,
        mode:props.mode,
        idata:props.idata,
        catalogueType: props.catalogueType,
        dataLoading:false,
        addItems:{},
        addMeta:{}
    }
    //this.addItems={}
    //this.addMeta={}
}

  componentWillReceiveProps(newProps) {
      if (newProps.mode) {
          this.setState({mode:newProps.mode});
      }
      if (newProps.idata) {
          this.setState({idata:newProps.idata});
      }
  }

  
  add_auth = (xhr) => {
      
    var self=this;
    var api_key=self.props.api_key;
    var api_auth=self.props.api_auth;
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
  
  
save_item = (parent_href, new_href, user_item=null) => {
        var self=this;
        //var html='<img src="images/wait.gif"  width=100>';
        //$('#' + id).html(html);
        self.setState({dataLoading:true});
        
        $.ajax({
            beforeSend: function(xhr){
                self.add_auth(xhr);
                //setHeaders(xhr);
            
            },
            type: 'GET',
            url: '/cat/post?parent_href=' + encodeURIComponent(parent_href) + '&href=' + encodeURIComponent(new_href),
            data: JSON.stringify(user_item),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(body, textStatus, xhr) {
                self.setState({dataLoading:false});
                console.log("New Item Added")
                console.log(body);
                var item=self.state.idata;
                item.node_href=parent_href;
                if (body.href) {
                    item.item_href=body.href;
                    item.href=body.href;
                } else {
                    item.item_href=new_href;
                    item.href=new_href;

                }
                if ('items' in body)
                    item.items=body.items;
                else
                    item['items']=[];
                if (body['catalogue-metadata'] && body['catalogue-metadata'].length > 0) {
                    item['catalogue-metadata']=body['catalogue-metadata']
                    item[self.state.catalogueType]=body['catalogue-metadata']

                } else {
                    //body['catalogue-metadata']=[];
                    //item[self.props.catalogueType]=[]

                }
                self.setState({loading:false, idata:item, mode:'view'})
            },
            error: function(xhr, textStatus, err) {
                console.log(xhr.status + ' ' + xhr.statusText);
            }
        });
}

refreshCatalogue = (data) => {
    var idata=this.state.idata;
    idata[this.state.catalogueType]=data['catalogue-metadata'];
    idata['items']=data['items']
    this.setState({idata: idata});
}


render() {
    var self=this;
    var item=this.state.idata;
    var eth1_amount=1000000000000000000;
    if (this.state.loading) {
            return (
                <div id={"location_save_loading"} style={{ height: "100%"}} key={item.id}>
                    <center>
                    <img src="images/wait.gif"  width={100} />
                    </center>
                </div>
            )
    } else {
        if (this.state.mode && this.state.mode=='edit') {
                var url = item.href ? item.href : item.node_href + '/<catalogue_name>';
                console.log(item);
                return (
                    
                    <ContractFormDAO
                    contract={item.address} 
                    catAdd={true}
                    showDeviceUI={this.props.showDeviceUI} 
                    idata={item}
                    refreshCatalogue={(res) => {
                        self.setState({idata:res, mode:'view', hideAddItem:true, showClose:true})
                    }} 
                    />  
                    );

                    /*
                    <div key={item.id + "_add"}>
              
                        <div style={{textAlign:'left'}}><b>Add to Catalogue</b></div>
                        <div  className={"input-group"}>
                        <input className={"form-control"} type={"text"} id={item.id + "_new_url"} defaultValue={url} />
                            <button className={"btn btn-primary"} type={"button"} 
                                    onClick={() => {
                                        var item=self.state.idata;
                                        var href=$('#' + item.id + "_new_url").val();
                                        item.href=href;
                                        item.item_href=href;
                                        self.setState({idata:item, mode:'view', hideAddItem:true});
                                        self.save_item(item.node_href,href,  item[this.props.catalogueType]);
                                    }}>Save</button>
                        </div>
                    </div>
                    */
        } else if (this.state.mode && this.state.mode=='view') {

            item.href = item.href.toString(); 
            var isCat = false;
            var isGenericResource = false;
            var supportsQueryOpenIoT = false;
            isCat=true;

            var items=[];
            var count=0;
        
            var map_json={};
            if (this.state.catalogueType in item) {
                item[this.state.catalogueType].map(mdata  => {
                    if (mdata.rel == 'urn:X-tsbiot:rels:supports:query' && mdata.val == 'urn:X-tsbiot:query:openiot:v1')
                        supportsQueryOpenIoT = true;
                    mdata.node_href=item.node_href;
                    mdata.item_href=item.href;
                    mdata.id=item.id + "_item_metadata_" + count;
                    mdata.contract_address=item.address;
                    var ires=<MetaData
                            key={mdata.id} 
                            mdata={mdata} 
                            item={item}
                            mode={'view'} 
                            refreshCatalogue={() => {
                            }} 
                            />;
                    //if (mdata.rel == "urn:X-tsbiot:rels:isContentType" && mdata.val == "application/vnd.tsbiot.catalogue+json")
                    //    isCat = true;
                    //if (mdata.rel == "urn:X-tsbiot:rels:isContentType" && (mdata.val == "application/senml+json" 
                    // || mdata.val == "CompositeContentType"))
                    //    isGenericResource = true;
                    if (mdata.rel == "http://www.w3.org/2003/01/geo/wgs84_pos#lat") {
                        map_json["Latitude"]=mdata.val;
                        map_json["LatitudeData"]=mdata;
                    }

                    if (mdata.rel == "http://www.w3.org/2003/01/geo/wgs84_pos#long") {
                        map_json["Longitude"]=mdata.val;
                        map_json["LongitudeData"]=mdata;
                    }

                    count+=1;
                    items.push(ires);
                });
            }
            var buttonKey=item.address;
            var cmdata={ 
                id: "catalogue_create_meta_data_" + Math.round(Math.random() * 10000),
                href: item.href,
                item_href: item.href,
                contract_address:item.address,
                rel: '',
                val: ''}
            const moreAddItem = (item, cmdata) => {
                var addMeta = self.state.addMeta;
                addMeta[item.address].push(<MetaData 
                    key={Math.random()} 
                    mdata={cmdata} 
                    item={item}
                    mode={'add'} 
                    refreshCatalogue={() => {
                        self.props.closeDialog();
                        APIUtils.browse({api_key: self.props.api_key, api_auth:self.props.api_auth}, item.href, 
                            (listHtml, doc, urls) => {
                                self.refreshCatalogue(doc);
                                setTimeout(() => {
                                    $('#' + buttonKey).trigger('click');
                                    self.props.closeDialog2();
                                }, 1000)
                        })
                        
                    }}  
                    />);  
                //self.setState(addMeta); 
                // self.state.addMeta=addMeta;
                //console.log(self.state.addMeta);
            }

            if (!(item.address in this.state.addMeta)) {
                var addMeta = this.state.addMeta;
                addMeta[item.address]=[];

                moreAddItem(item, cmdata);
            } else {
                //console.log(this.state.addMeta[item.address])
                //moreAddItem(item, cmdata);
            }

            if ("Latitude" in map_json) {
                cmdata.lat=map_json["Latitude"];
                cmdata.LatitudeData=map_json["LatitudeData"];
            } else {
                cmdata.lat=0;
            }
            if ("Longitude" in map_json) {
                cmdata.lng=map_json["Longitude"];
                cmdata.LongitudeData=map_json["LongitudeData"];
            } else {
                cmdata.lng=0;
            }
            var editLoc=<MetaData 
                key={cmdata.id + '_location'} 
                mdata={cmdata} 
                item={item}
                mode={'editLoc'} 
                refreshCatalogue={self.refreshCatalogue}  
                />
            return (
                <div style={{ flex: "1 1 250px", position: "relative", height: '323px', margin: '2px'}}> 
                    <Card style={{ height: '323px' }}>
                        <pre
                        style={{
                            whiteSpace: "pre-wrap",  
                            width:"100%"

                        }}
                        >
                        <a href={"/iotpedia/editor?url=" + item.href}
                        >
                        {item.href}
                        </a>
                        </pre>      
                            <center>      
                            <b>{item.address}</b><br/>
                            <QRCode value={item.address} /><br/>
                            <span>
                                <b>
                                <ContractDAO contract={"SmartKey"} 
                                                                method="getBalance" 
                                                                methodArgs={[item.address]} 
                                                                isLocaleString={true} /> IOTBLOCK
                                </b>
                            </span>
                            </center>
                            <br/>
                   
                        <CardActions style={{position: "absolute",
                                bottom: 0,
                                left: 0,
                                width:"100%"}}>
                             <Button label='View / Contribute Item Details' raised primary 
                                style={{width:"100%"}}
                                id={buttonKey}
                                onClick={() => {
                                
                                    this.props.showDialog(true, 
                                    <div style={{ height: window.innerHeight * 0.9,
                                                overflowY: "auto" }}>
                                        {self.state.dataLoading ? (
                                        <b>Processing Contribution...
                                            <br/>
                                        </b>
                                    ) : null}

                                    <center>                  
                                    <b>{item.address}</b><br/><br/>
                                    <QRCode value={item.address} /><br/><br/>
                                    <span>
                                        <b>
                                        The Catalogue Earned &nbsp;
                                        <ContractDAO contract={"SmartKey"} 
                                                                        method="getBalance" 
                                                                        methodArgs={[item.address]} 
                                                                        isLocaleString={true} /> IOTBLOCK
                                        </b><br/><br/>
                                    </span>
                                    </center>
                                    <pre
                                    style={{
                                        whiteSpace: "pre-wrap",  
                                        width:"100%"

                                    }}
                                    >
                                    <a href={"/iotpedia/editor?url=" + item.href}
                                    >
                                    {item.href}
                                    </a>
                                    </pre>      
                                
                                <br/>
                                        {items}
                                
                                    {self.state.addMeta[item.address].map(item => {
                                        return item;
                                    })}
                                    {editLoc}

                                    {item.href ? 
                                    <NodeKey isNode={true} url={item.href} />
                                        : null}
                                    <Button style={{width:"100%"}} raised primary onClick={() => {
                                        self.props.closeDialog();
                                        }}>Close</Button> 
                                    </div>);
                                }}
                                
                                />
                        </CardActions>
                    </Card>
                    <br/>

                    
                    {self.props.showAddItem && !self.state.hideAddItem ? (

                        
                          <CatalogueDAO 
                                {...self.props}
                                catalogueType={'item-metadata'}
                                idata={{
                                    id:'add_catalogue_item_' + Math.round(Math.random() * 100000),
                                    node_href:self.state.idata.node_href,
                                    href:self.state.idata.href ? self.state.idata.href : '',
                                    items:[],            
                                }} 
                                mode={'add'} 
                                browse={self.props.browse} 
                        />

                    ) : null}
                    {self.state.showClose ? <button onClick={() => {
                        self.props.closeDialog();
                    }}>Close</button> : null}
                </div>
                
            );
        }  else if (this.state.mode && this.state.mode=='add') {
            if ('showButton' in this.props && 'itemName' in this.props) {
                if (this.props['showButton'] && this.props['itemName']){ 
                        return <div><button className={"form-control button3 btn btn-primary"}
                        type={"button"}
                        style={{height:"80px", width:"100%"}}
                        //style={{ maxWidth:"100px"}}
                        onClick={() => {
                            console.log(this.props.idata)
                            this.props.showDialog(true, 
                                <CatalogueDAO 
                                        catalogueType={'catalogue-metadata'}
                                        showAddItem={true}
                                        showButton={true}
                                        showDeviceUI={this.props.itemName}
                                        itemName={this.props.itemName ? this.props.itemName : ''}
                                        idata={{
                                            address: self.props.idata.address,
                                            id:'add_catalogue_item',
                                            node_href:'https://iotblock.io/cat/StandardIndustrialClassification/BarCodes',
                                            href: 'https://iotblock.io/cat/StandardIndustrialClassification/BarCodes/' + this.props.itemName,
                                            items:[],          
                                            "catalogue-metadata": [
                                               
                                            ]
                                            
                                        }}
                                        mode={'edit'} 
                                        browse={() => {
                                            window.location='/iotpedia/editor?url=https://iotblock.io/cat/StandardIndustrialClassification/BarCodes/' + this.props.itemName
                                        }} />

                            );
                        


                            //self.setState({mode:'edit'});
                        }} ><span className={"buttonText"}>Add</span></button>
                        </div>
                }
            } else {
                return (
                    <li id={"add_catalogue_item"}>
                        [<a href={"#add_catalogue_item"}
                            onClick={() => {
                                this.props.showDialog(true, 
                                    <CatalogueDAO 
                                                {...self.props}
                                                catalogueType={'item-metadata'}
                                                idata={{
                                                    address: self.props.idata.address,
                                                    id:'add_catalogue_item_' + Math.round(Math.random() * 100000),
                                                    node_href:self.state.idata.node_href,
                                                    href:self.state.idata.href ? self.state.idata.href : '',
                                                    items:[],            
                                                }} 
                                                mode={'edit'} 
                                                browse={self.props.browse} 
                                        />

                                );
                                    //self.setState({mode:'edit'});
                            }}> 
                            Add Item 
                        </a>] 
                    </li>
                )
            }
        } else if (this.state.mode && this.state.mode=='browse') {

            item.href = item.href.toString(); 
            var isCat = false;
            var isGenericResource = false;
            var supportsQueryOpenIoT = false;
            isCat=true;

            var items=[];
            var count=0;
        
            var map_json={};
            if (this.state.catalogueType in item) {
                item[this.state.catalogueType].map(mdata  => {
                    if (mdata.rel == 'urn:X-tsbiot:rels:supports:query' && mdata.val == 'urn:X-tsbiot:query:openiot:v1')
                        supportsQueryOpenIoT = true;
                    mdata.node_href=item.node_href;
                    mdata.item_href=item.href;
                    mdata.id=item.id + "_item_metadata_" + count;
                    mdata.contract_address=item.address;
                    var ires=<MetaData 
                            key={mdata.id} 
                            item={item}
                            mdata={mdata}
                            mode={'browse'}
                            refreshCatalogue={() => {
                            }} 
                            />;

                    if (mdata.rel == "http://www.w3.org/2003/01/geo/wgs84_pos#lat") {
                        map_json["Latitude"]=mdata.val;
                        map_json["LatitudeData"]=mdata;
                    }
                    
                    if (mdata.rel == "http://www.w3.org/2003/01/geo/wgs84_pos#long") {
                        map_json["Longitude"]=mdata.val;
                        map_json["LongitudeData"]=mdata;
                    }
                    
                    count+=1;
                    items.push(ires);
                });
            }
            var cmdata={ 
                id: "catalogue_create_meta_data_" + Math.round(Math.random() * 10000),
                href: item.href,
                item_href: item.href,
                rel: '',
                val: ''}
            
            /*
            items.push(<MetaData 
                key={cmdata.id} 
                mdata={cmdata} 
                mode={'add'} 
                refreshCatalogue={self.refreshCatalogue}  
                />);
            */

            if ("Latitude" in map_json) {
                cmdata.lat=map_json["Latitude"];
                cmdata.LatitudeData=map_json["LatitudeData"];
            } else {
                cmdata.lat=0;
            }
            if ("Longitude" in map_json) {
                cmdata.lng=map_json["Longitude"];
                cmdata.LongitudeData=map_json["LongitudeData"];
            } else {
                cmdata.lng=0;
            }
            /*
            items.push(<MetaData 
                key={cmdata.id + '_location'} 
                mdata={cmdata} 
                mode={'editLoc'} 
                refreshCatalogue={self.refreshCatalogue}  
                />)
            */
            return (
                <div style={{ flex: "1 1 250px", position: "relative", height: '180px', margin: '2px'}}> 
                    <Card style={{ height: '180px' }}>
                        <pre
                        style={{
                            whiteSpace: "pre-wrap",  
                            width:"100%"

                        }}
                        >
                            <a href={"/iotpedia/editor?url=" + item.href}
                            >
                            {item.href}
                            </a>
                        </pre>
                    
                            <center>                  


                                    <span>
                                        <b>
                                        <ContractDAO contract={"SmartKey"} 
                                                                        method="getBalance" 
                                                                        methodArgs={[item.address]} 
                                                                        isLocaleString={true} /> IOTBLOCK
                                        </b>
                                    </span>
                            </center>
                    <br/>
                    <CardActions style={{position: "absolute",
                                bottom: 0,
                                left: 0,
                                width:"100%"}}>

                    <Button label='View / Contribute Info' raised primary 
                    style={{width:"100%"}}
                    onClick={() => {
                    
                        this.props.showDialog(true, 
                        <div style={{ height: window.innerHeight * 0.9,
                                      overflowY: "auto" }}>
                            {self.state.dataLoading ? (
                                <b>Processing Contribution...
                                    <br/>
                                </b>
                            ) : null}
                            <center>                  
                            <span>
                                <b>
                                The Catalogue Earned 
                                <ContractDAO contract={"SmartKey"} 
                                                                method="getBalance" 
                                                                methodArgs={[item.address]} 
                                                                isLocaleString={true} /> IOTBLOCK
                                </b><br/>
                            </span>
                            </center>
                            <pre
                            style={{
                                whiteSpace: "pre-wrap",  
                                width:"100%"

                            }}
                            >
                            <a href={"/iotpedia/editor?url=" + item.href}
                            >
                            {item.href}
                            </a>
                            </pre>      
                            
                            <br/>
                            {items}
                            <Button style={{width:"100%"}} raised primary onClick={() => {
                                self.props.closeDialog();
                            }}>Close</Button> 

                        </div>)
                    }} />
                    
                    
                    </CardActions>
                    </Card>

                </div>
                
            );
        }
    }
  }
}


CatalogueDAO.contextTypes = {
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
        closeDialog2: () => {
            dispatch(actions.closeDialog2());
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
  
  
  
  
  export default connect( stateToProps, dispatchToProps)( drizzleConnect(CatalogueDAO,drizzleStateToProps, drizzleDispatchToProps))
  
