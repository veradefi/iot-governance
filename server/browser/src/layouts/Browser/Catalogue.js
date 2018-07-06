import React, { Component } from 'react'
import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import MetaData from "./MetaData"
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
export default class Catalogue extends Component {
   static propTypes = {
        showDialog:PropTypes.func.isRequired,
        closeDialog:PropTypes.func.isRequired,
        api_auth: PropTypes.string.isRequired,
        api_key: PropTypes.string.isRequired,
        eth_contrib: PropTypes.number.isRequired,
        isAuthenticated: PropTypes.bool.isRequired,
        browse:PropTypes.func,
        showAddItem:PropTypes.bool
  };
  
  constructor(props) {
    super(props)
    this.state={
        loading:false,
        mode:props.mode,
        idata:props.idata,
        dataLoading:false
    }
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
                item.item_href=body.href;
                item.href=body.href;
                if ('items' in body)
                    item.items=body.items;
                else
                    item['items']=[];
                item['catalogue-metadata']=body['catalogue-metadata']
                item[self.props.catalogueType]=body['catalogue-metadata']
                self.setState({idata:item, mode:'view'})
            },
            error: function(xhr, textStatus, err) {
                console.log(xhr.status + ' ' + xhr.statusText);
            }
        });
}

refreshCatalogue = (data) => {
    var idata=this.state.idata;
    idata[this.props.catalogueType]=data['catalogue-metadata'];
    idata['items']=data['items']
    this.setState({idata, idata});
}


  render() {
    var self=this;
    var item=this.state.idata;
    var eth1_amount=1000000000000000000;
    if (this.state.loading) {
        return (
            <div id={"location_save_loading"} key={item.id}>
                <center>
                <img src="images/wait.gif"  width={100} />
                </center>
            </div>
        )
    } else {
        if (this.state.mode && this.state.mode=='edit') {
                var url = item.node_href + '/<catalogue_name>';
            return (
                
                <div key={item.id + "_add"} className={"input-group"}>
                    <span><h3>URL:</h3></span>
                    <input className={"form-control"} type={"text"} id={item.id + "_new_url"} defaultValue={url} />
                    <div className={"input-group-append"}>
                        <button className={"btn btn-primary"} type={"button"} 
                                onClick={() => {
                                    var item=self.state.idata;
                                    var href=$('#' + item.id + "_new_url").val();
                                    item.href=href;
                                    item.item_href=href;
                                    self.setState({idata:item, mode:"view"});
                                    self.save_item(item.node_href,href);
                                }}>Save</button>
                    </div>
                </div>
            );
        } else if (this.state.mode && this.state.mode=='view') {

            item.href = item.href.toString(); 
            var isCat = false;
            var isGenericResource = false;
            var supportsQueryOpenIoT = false;
            isCat=true;

            var items=[];
            var count=0;
        
            var map_json={};
            if (this.props.catalogueType in item) {
                item[this.props.catalogueType].map(mdata  => {
                    if (mdata.rel == 'urn:X-tsbiot:rels:supports:query' && mdata.val == 'urn:X-tsbiot:query:openiot:v1')
                        supportsQueryOpenIoT = true;
                    mdata.node_href=item.node_href;
                    mdata.item_href=item.href;
                    mdata.id=item.id + "_item_metadata_" + count;
                    var ires=<MetaData key={mdata.id} mdata={mdata} mode={'view'} refreshCatalogue={self.refreshCatalogue} />;
                    //if (mdata.rel == "urn:X-tsbiot:rels:isContentType" && mdata.val == "application/vnd.tsbiot.catalogue+json")
                    //    isCat = true;
                    //if (mdata.rel == "urn:X-tsbiot:rels:isContentType" && (mdata.val == "application/senml+json" || mdata.val == "CompositeContentType"))
                    //    isGenericResource = true;
                if (mdata.rel == "http://www.w3.org/2003/01/geo/wgs84_pos#lat") {
                        map_json["Latitude"]=mdata.val;
                    }
                    if (mdata.rel == "http://www.w3.org/2003/01/geo/wgs84_pos#long") {
                        map_json["Longitude"]=mdata.val;
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
            items.push(<MetaData key={cmdata.id} mdata={cmdata} mode={'add'} refreshCatalogue={self.refreshCatalogue}  />);
            
            return (
                <div key={item.id}> 
                    <li><a href={"#top"}
                       onClick={()=>{
                           self.props.browse(item.href, () => {

                           });
                       }}
                       >
                       {item.href}
                    </a>
                    <br/>
                    {self.state.dataLoading ? (
                        <b>Processing Contribution...
                            <br/>
                        </b>
                    ) : null}
                    <br/>
                    </li>
                    <ul>
                    {items}
                    <li id={"catalogue_get_location"}> [ 
                        <a href={"#catalogue_get_location"} 
                        onClick={() => {
                            self.getMap();
                            }}> Edit Location </a> ]<br/><br/>
                    </li>

                    </ul>

                    {self.props.showAddItem ? (

                    <Catalogue 
                            {...self.props}
                            catalogueType={'item-metadata'}
                            idata={{
                            id:'add_catalogue_item_' + Math.round(Math.random() * 100000),
                            node_href:self.state.idata.node_href,
                            href:'',
                            items:[],            
                        }} mode={'add'} browse={self.props.browse} />
                    ) : null}
                </div>
                
            );
        }  else if (this.state.mode && this.state.mode=='add') {
            return (
                 <li id={"add_catalogue_item"}>
                    [<a href={"#add_catalogue_item"}
                        onClick={() => {
                            self.setState({mode:'edit'});
                        }}> 
                        Add Item 
                    </a>] 
                 </li>
            )
        }
    }
  }
}
