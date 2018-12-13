import React, { Component } from 'react'
import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import MapDataDAO from "./MapDataEOS";
import ContractFormDAO from '../../util/web3/ContractFormEOS'
import ContractDAO from '../../util/web3/ContractEOS'
import AccountDAO from '../../util/web3/AccountEOS'
import { drizzleConnect } from 'drizzle-react'
import * as web3Utils from "../../util/web3/web3Utils";

var $ = require ('jquery');



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
        showDialog2: (show, content) => {
            dispatch(actions.showDialog2(show, content));
        },
        closeDialog2: () => {
            dispatch(actions.closeDialog2());
        },  
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

const drizzleDispatchToProps = dispatch => {
    return {
        addContract: (drizzle, poolcfg, events, web3) => {
            dispatch(actions.addContract(drizzle, poolcfg, events, web3));
        },
    };
};



//@connect(stateToProps, dispatchToProps)
class MetaData extends Component {
   static propTypes = {
        showDialog:PropTypes.func.isRequired,
        closeDialog:PropTypes.func.isRequired,
        showDialog2:PropTypes.func.isRequired,
        closeDialog2:PropTypes.func.isRequired,
        api_auth: PropTypes.string.isRequired,
        api_key: PropTypes.string.isRequired,
        eth_contrib: PropTypes.number.isRequired,
        isAuthenticated: PropTypes.bool.isRequired,
        refreshCatalogue:PropTypes.func,
        metaDataAddress:PropTypes.string,
        mdata:PropTypes.object,
        item:PropTypes.object
  };
  
  constructor(props, context) {
    super(props)
    /*
    if (props.mdata && props.mdata.address) {
        var cfg=Object.assign({}, web3Utils.get_meta_contract_cfg(props.mdata.address));
        var events=[];
        var web3=web3Utils.get_web3();
        var drizzle=context.drizzle;
        //this.setState({loading:false})
        //context.drizzle.addContract({cfg, events})
        
        props.addContract(drizzle, cfg, events, web3) 
    }
    */
    this.state={
        loading:false,
        mode:props.mode,
        mdata:props.mdata,
        dataLoading:false,
    }
  }

  componentDidMount() {

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
                  <ContractFormDAO
                        contract={mdata.address} 
                        metaEdit={true} 
                        item={this.props.item}
                        mdata={mdata}
                        />       
                    
            );
        } else if (this.state.mode && this.state.mode=='view') {
            return (
              
                <ContractFormDAO
                        contract={mdata.address} 
                        metaView={true} 
                        item={this.props.item}
                        mdata={mdata}
                        />  
            )
               
        }  else if (this.state.mode && this.state.mode=='add') {
            return (
                <ContractFormDAO
                        contract={this.props.item.address} 
                        metaAdd={true} 
                        item={this.props.item}
                        mdata={mdata}
                        procMetaAdd2={() => {
                            this.props.showDialog2(true, 
                                <ContractFormDAO
                                contract={self.props.item.address} 
                                metaAdd2={true} 
                                mdata={mdata}
                                item={self.props.item}
                                refreshCatalogue={() => {
                                    this.props.refreshCatalogue();
                                }}
                              /> )

                        }}
                        refreshCatalogue={() => {
                            this.props.refreshCatalogue();
                        }}
                        />  
            )
        }  else if (this.state.mode && this.state.mode=='editLoc') {
            return (
                <li 
                        id={mdata.id} 
                        key={mdata.id}>
                        [<span style={{'cursor':'pointer'}}
                        onClick={() => {
                                self.setState({mode:'editMap'});
                                //self.add_meta('catalogue_create_meta_data_' + i, url, item.href);
                                }}> 
                        Add / Edit Location
                        </span>] 
                        
            <br/><br/>
            
            </li>
            )
        } else if (this.state.mode && this.state.mode=='editMap') {
            return (
                
                    <MapDataDAO 
                    contract={this.props.item.address} 
                    lat={mdata.lat} 
                    lng={mdata.lng} 
                    id={mdata.id} 
                    mdata={mdata} 
                    />
            )
        } else if (this.state.mode && this.state.mode=='saveMap') {
            return (
                <li 
                        id={mdata.id} 
                        key={mdata.id}>
                    <b>Processing Contribution...</b>

            <br/><br/>
            
            </li>
            )
        } else if (this.state.mode && this.state.mode=='browse') {
            return (
                <li id={mdata.id} key={mdata.id}> 
                        &nbsp;
                       
                        {mdata.rel} <pre style={{whiteSpace: "pre-wrap",  width:"81%"}}>{mdata.val}</pre>

                        <br/>
                        {self.state.dataLoading ? (
                            <b>Processing Contribution... <br/></b>
                        ) : <span><b>Donation Received: <ContractDAO contract={"SmartKey"} 
                        method="getBalance" 
                        methodArgs={[mdata.address]} 
                        isLocaleString={true} /> &nbsp;
              IOTBLOCK </b></span>

                         }
                </li>
            )
        } 
    }
  }
}


MetaData.contextTypes = {
    drizzle: PropTypes.object
  }

//  drizzleConnect(MetaData,drizzleStateToProps, drizzleDispatchToProps),
export default connect( stateToProps, dispatchToProps)( MetaData )