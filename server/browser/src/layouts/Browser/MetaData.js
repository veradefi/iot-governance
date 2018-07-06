import React, { Component } from 'react'
import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
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
export default class MetaData extends Component {
   static propTypes = {
        showDialog:PropTypes.func.isRequired,
        closeDialog:PropTypes.func.isRequired,
        api_auth: PropTypes.string.isRequired,
        api_key: PropTypes.string.isRequired,
        eth_contrib: PropTypes.number.isRequired,
        isAuthenticated: PropTypes.bool.isRequired,
        refreshCatalogue:PropTypes.func,
  };
  
  constructor(props) {
    super(props)
    this.state={
        loading:false,
        mode:props.mode,
        mdata:props.mdata,
        dataLoading:false,
    }
  }

  componentWillReceiveProps(newProps) {
      if (newProps.mode) {
          this.setState({mode:newProps.mode});
      }
      if (newProps.mdata) {
          this.setState({mdata:newProps.mdata});
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

  save_meta = (rel, val, node_href, item_href) =>  {
        var self=this;
        var key='';
        this.setState({dataLoading:true})
        var post_url='/cat/postNodeMetaData?href=' + encodeURIComponent(item_href);
        
        if (node_href && item_href != node_href) {
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
                console.log("Meta Data Save Completed");
                console.log(body);
                self.setState({dataLoading:false})
                
                if (self.props.refreshCatalogue !== undefined) {
                    self.props.refreshCatalogue(body);
                } else {
                    var data=body['catalogue-metadata'];
                    data.map(meta => {
                        if (meta.rel == rel) {
                            var mdata=self.state.mdata;
                            mdata.rel=meta.rel;
                            mdata.val=meta.val;
                            mdata.bal=meta.bal;
                            self.setState({mdata, mdata});
                        }

                    })
                }
                //self.browse($('#browse_url').val(), function() {
                //    console.log('browse complete');
                //});
            },
            error: function(xhr, textStatus, err) {
                console.log(xhr.status + ' ' + xhr.statusText);
            }
        });

    //alert(id);  
}


  render() {
    var self=this;
    var mdata=this.state.mdata;
    var eth1_amount=1000000000000000000;
    if (this.state.loading) {
        return (
            <div id={"location_save_loading"} key={mdata.id}>
                <center>
                <img src="images/wait.gif"  width={100} />
                </center>
            </div>
        )
    } else {
        if (this.state.mode && this.state.mode=='edit') {
            return (
                 <div className={"input-group"} key={mdata.id}>
                    <input className={"form-control"} 
                            type={"text"} 
                            id={mdata.id + '_rel'}
                            defaultValue={mdata.rel} />
                    <span style={{verticalAlign:"middle"}}>
                        <h1> = </h1>
                    </span>
                    <input className={"form-control"} 
                            type={"text"} 
                            id={mdata.id + '_val'}
                            defaultValue={mdata.val} />
                            
                        <div className={"input-group-append"}>
                            <button className={"btn btn-primary"} type="button"
                            onClick={() => {
                                mdata.rel= $('#' + mdata.id + "_rel").val();
                                mdata.val= $('#' + mdata.id + "_val").val();
                                
                                self.save_meta(
                                            mdata.rel,
                                            mdata.val,
                                            mdata.node_href, 
                                            mdata.item_href);
                                this.setState({
                                    mode:'view',
                                    mdata: mdata
                                });

                            }}> Save </button>
                        </div>
                 </div>
            );
        } else if (this.state.mode && this.state.mode=='view') {
            return (
                <li id={mdata.id} key={mdata.id}> 
                        [ <a href={"#" + mdata.id}
                             onClick={() => {
                                this.setState({mode:'edit'});
                             }}> 
                             Edit 
                           </a> 
                        ] &nbsp; 
                        {mdata.rel} = {mdata.val}
                        <br/>
                        {self.state.dataLoading ? (
                            <b>Processing Contribution... <br/></b>
                        ) : 
                        mdata.bal ? (
                        <b>Donation Received: {parseFloat(mdata.bal)/eth1_amount} ETH 
                        <br/>
                        </b> 
                        ) : null }
                        <br/>
                </li>
            )
        }  else if (this.state.mode && this.state.mode=='add') {
            return (
                <li 
                        id={mdata.id} 
                        key={mdata.id}>
                        [<a href={"#" + mdata.id}
                            onClick={() => {
                                this.setState({mode:'edit'});
                                //self.add_meta('catalogue_create_meta_data_' + i, url, item.href);
                                }}> 
                        Add Meta Data 
                        </a>] 
            <br/><br/>
            
            </li>
            )
        }
    }
  }
}
