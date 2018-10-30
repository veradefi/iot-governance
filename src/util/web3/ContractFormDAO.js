import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as web3Utils from "../../util/web3/web3Utils";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import Autocomplete from 'react-toolbox/lib/autocomplete';


const source = {
  'urn:X-hypercat:rels:isContentType': 'urn:X-hypercat:rels:isContentType',
  'urn:X-hypercat:rels:supportsSearch': 'urn:X-hypercat:rels:supportsSearch',
  'urn:Xhypercat:rels:hasDescription': 'urn:Xhypercat:rels:hasDescription',
  'urn:X-hypercat:rels:containsContentType':'urn:X-hypercat:rels:containsContentType',
  'urn:X-hypercat:rels:hasHomepage': 'urn:X-hypercat:rels:hasHomepage',
  'urn:X-hypercat:rels:lastUpdated':'urn:X-hypercat:rels:lastUpdated',
  'urn:X-hypercat:rels:launchDate':'urn:X-hypercat:rels:launchDate',
  'urn:X-hypercat:rels:jws:alg':'urn:X-hypercat:rels:jws:alg',
  'urn:X-hypercat:rels:jws:signature':'urn:X-hypercat:rels:jws:signature',
  'urn:X-hypercat:rels:accessHint':'urn:X-hypercat:rels:accessHint',
  'urn:X-hypercat:rels:acquireCredential':'urn:X-hypercat:rels:acquireCredential',
  'urn:X-hypercat:rels:eventsource':'urn:X-hypercat:rels:eventsource',
  'urn:X-hypercat:rels:hasLicense':'urn:X-hypercat:rels:hasLicense',
  'urn:X-hypercat:rels:hasRobotstxt':'urn:X-hypercat:rels:hasRobotstxt',
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#type':'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
  'http://www.w3.org/2003/01/geo/wgs84_pos#lat':'http://www.w3.org/2003/01/geo/wgs84_pos#lat',
  'http://www.w3.org/2003/01/geo/wgs84_pos#long':'http://www.w3.org/2003/01/geo/wgs84_pos#long',
  'urn:X-hypercat:rels:hasColour': 'urn:X-hypercat:rels:hasColour',
  'urn:X-hypercat:rels:hasMedia': 'urn:X-hypercat:rels:hasMedia',
  'urn:X-hypercat:rels:hasMedia2': 'urn:X-hypercat:rels:hasMedia2',
  'urn:X-hypercat:rels:hasMedia3': 'urn:X-hypercat:rels:hasMedia3',
  'urn:X-hypercat:rels:health':'urn:X-hypercat:rels:health',
  'urn:X-hypercat:rels:healthStatus':'urn:X-hypercat:rels:healthStatus'
};


const source2 = [
  'urn:X-hypercat:rels:isContentType',
  'urn:X-hypercat:rels:supportsSearch',
  'urn:Xhypercat:rels:hasDescription',
  'urn:X-hypercat:rels:containsContentType',
  'urn:X-hypercat:rels:hasHomepage',
  'urn:X-hypercat:rels:lastUpdated',
  'urn:X-hypercat:rels:launchDate',
  'urn:X-hypercat:rels:jws:alg',
  'urn:X-hypercat:rels:jws:signature',
  'urn:X-hypercat:rels:accessHint',
  'urn:X-hypercat:rels:acquireCredential',
  'urn:X-hypercat:rels:eventsource',
  'urn:X-hypercat:rels:hasLicense',
  'urn:X-hypercat:rels:hasRobotstxt',
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
  'http://www.w3.org/2003/01/geo/wgs84_pos#lat',
  'http://www.w3.org/2003/01/geo/wgs84_pos#long',
  'urn:X-hypercat:rels:hasColour',
  'urn:X-hypercat:rels:hasMedia',
  'urn:X-hypercat:rels:hasMedia2',
  'urn:X-hypercat:rels:hasMedia3',
  'urn:X-hypercat:rels:health',
  'urn:X-hypercat:rels:healthStatus'
];

/*
 * Create component.
 */

class ContractForm extends Component {
  constructor(props, context) {
    super(props);

    if (this.props.contract) {
      this.contracts = context.drizzle.contracts

      if (props.metaEdit || props.metaView) {

            var cfg=Object.assign({}, web3Utils.get_meta_contract_cfg(this.props.contract));
            var events=[];
            var web3=web3Utils.get_web3();
            var drizzle=context.drizzle;
            //this.setState({loading:false})
            //context.drizzle.addContract({cfg, events})
            
            props.addContract(drizzle, cfg, events, web3) 
          
      }
      if (props.metaAdd) {
        var cfg=Object.assign({}, web3Utils.get_item_contract_cfg(this.props.contract));
        var events=[];
        var web3=web3Utils.get_web3();
        var drizzle=context.drizzle;
        //this.setState({loading:false})
        //context.drizzle.addContract({cfg, events})
        
        props.addContract(drizzle, cfg, events, web3) 
      }

      var url='';
      if (props.catAdd) {
        var cfg=Object.assign({}, web3Utils.get_item_contract_cfg(this.props.contract));
        var events=[];
        var web3=web3Utils.get_web3();
        var drizzle=context.drizzle;
        //this.setState({loading:false})
        //context.drizzle.addContract({cfg, events})
        if (props.idata && props.idata.href) {
            url=props.idata.href;
        }
        props.addContract(drizzle, cfg, events, web3) 
      }
    }
 
    var mode='metaView'
    if (this.props.metaEdit) {
      mode = 'metaEdit'
    }
    if (this.props.metaAdd) {
      mode='metaAdd'
    }
    if (this.props.catAdd) {
      mode='catAdd'
    }

    this.state={
      loading:false,
      mode:mode,
      mdata:props.mdata,
      url:url,
      //metaEdit:this.props.metaEdit,
      //dataKey:dataKey,
      //drizzleState: this.context.drizzle.store.getState(),
      //initialState:initialState,
    };

    

    //this.state = drizzle.store.getState()
    //this.state = initialState;
  }

  componentDidMount() {
  }
  handleSubmit() {
    if (this.props.sendArgs) {
      return this.contracts[this.props.contract].methods[this.props.method].cacheSend(...Object.values(this.state), this.props.sendArgs);
    }

    this.contracts[this.props.contract].methods[this.props.method].cacheSend(...Object.values(this.state));
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  translateType(type) {
    switch(true) {
        case /^uint/.test(type):
            return 'number'
            break
        case /^string/.test(type) || /^bytes/.test(type):
            return 'text'
            break
        case /^bool/.test(type):
            return 'checkbox'
            break
        default:
            return 'text'
    }
  }

  render() {
    var self=this;
    var mdata=this.state.mdata;
    var eth1_amount=1000000000000000000;

    
  

    var res=[];
    if (this.state.loading) {
      return (
          <li>
              <b>Processing Contribution... Please Confirm ETH Contribution<br/></b>
          </li>
      )
   }

    if (this.state.mode == 'metaView') {
      return <li>
                [ <a 
                    href={'JavaScript:'}
                    onClick={() => {
                        this.setState({mode:'metaEdit'});
                    }}> 
                    Edit 
                  </a> 
                ] &nbsp; 
                {mdata.rel} <pre style={{width:"88%"}}>{mdata.val}</pre>

                <br/>
                {self.state.dataLoading ? (
                    <b>Processing Contribution... <br/></b>
                ) : 
                mdata.bal ? (
                <b>Donation Received: { parseFloat(mdata.bal)/eth1_amount } ETH 
                <br/>
                </b> 
                ) : null }
                <br/>
        </li>
    }

    if (this.state.mode == 'metaAdd') {
                return (
                  <li>
                          [<span style={{'cursor':'pointer'}}
                              onClick={() => {
                                  this.props.refreshCatalogue();
                                  this.setState({mode:'metaAdd2'});
                                  //self.add_meta('catalogue_create_meta_data_' + i, url, item.href);
                                  }}> 
                          Add Meta Data 
                          </span>] 
              <br/><br/>
              
              </li>
              )
    }

    if (this.state.mode == 'metaAdd2') {
      return <li>
        <div>
                    
              <Autocomplete
                  direction="down"
                  label="Click Here to Choose or Specify PAS212:2016 Relation"
                  //hint="Specify PAS212:2016 Relation"
                  multiple={false}
                  allowCreate={true}
                  onChange={(val) => {
                    //alert(val);
                    mdata.rel=val;
                    self.setState({mdata,formRel:val});
                    
                  }}
                  onQueryChange={(val) => {
                    //alert(val);
                    mdata.rel=val;
                    self.setState({mdata,formRel:val});
                    
                  }}
                  showSelectedWhenNotInSource={true}
                  showSuggestionsWhenValueIsSet={true}
                  source={source2}
                  value={mdata.rel}
                />
        </div>
                <font size={2}>
                <b>Specify PAS212:2016 Value</b><br/>
                </font>
                <div className={"input-group"}>
                 
                    <textarea className={"form-control"} rows={10}
                                                style={{maxWidth:"80%"}}
                                                onChange={(e) => {
                                                  self.setState({formVal:e.target.value});
                                                  //alert(this.state.formVal);
                                                
                                                }}
                            defaultValue={mdata.val} />

                    <br/>
                          <button className={"btn btn-primary"} type="button"
                          onClick={() => {
                              
                            var method="upsertMetaData";
                            if (this.state.formVal && this.state.formRel) {
                                  var drizzleState=this.context.drizzle.store.getState()
                                  //alert(drizzleState.accounts[0]);
                                  //alert(this.props.eth_contrib)
                                  this.setState({loading:true})

                                  var contrib=Math.round(parseFloat(self.props.eth_contrib)*eth1_amount);
                                  //alert(contrib);
                                  this.contracts[this.props.contract].methods.upsertMetaData(this.state.formRel, this.state.formVal).send( 
                                     {from: drizzleState.accounts[0],  value: contrib, gasPrice:23000000000
                                     })
                                     .then(function(val)  {
                                       //alert(val);
                                       var mdata=self.state.mdata;
                                       mdata.rel=self.state.formRel,
                                       mdata.val=self.state.formVal;
                                       self.setState({
                                         loading:false,
                                         mode:'metaView',
                                         mdata: mdata
                                       });

         
                                     }).catch(function(error) {
                                       alert("Could not complete transaction")
                                       alert(error);
                                       console.log(error);
                                     });

                                  /*

                                  this.contracts[this.props.contract].methods[method].cacheSend(this.state.formRel, this.state.formVal, {
                                    from: drizzleState.accounts[0],  value: Math.round(parseFloat(this.props.eth_contrib)*eth1_amount), gas: 100000, gasPrice:23000000000
                                  });
                                  var mdata=this.state.mdata;
                                  mdata.rel=this.state.formRel,
                                  mdata.val=this.state.formVal;
                                  this.setState({
                                    mode:'metaView',
                                    mdata: mdata
                                  });
                                  */

                                }
                                
                              /*
                              self.save_meta(
                                          mdata.rel,
                                          mdata.val,
                                          mdata.node_href, 
                                          mdata.item_href);
                              this.setState({
                                  mode:'view',
                                  mdata: mdata
                              });
                              */

                          }}> Save </button>
              </div>
          </li>
  } 

  if (this.state.mode == 'catAdd') { 
        var item=this.props.idata;
        var url = item.href ? item.href : item.node_href + '/<catalogue_name>';
        console.log(item);
        return (
      
            <div key={item.id + "_add"}>
                <div style={{textAlign:'left'}}><b>Add to Catalogue</b></div>
                <div  className={"input-group"}>
                <input className={"form-control"} type={"text"} id={item.id + "_new_url"} 
                  onChange={(e) => {
                    self.setState({url:e.target.value});
                    //alert(url);
                  }}
                defaultValue={url} />
                    <button className={"btn btn-primary"} type={"button"} 
                            onClick={() => {
                              this.setState({loading:true})
                              var drizzleState=this.context.drizzle.store.getState()
                              var smartNode="SmartNode";
                              var method="upsertItem";
                              /*
                              web3Utils.add_node(this.props.idata.address, self.state.url).then(function (node_address) {
                                self.setState({loading:false})

                                item.href=self.state.url;
                                window.location='/iotpedia/editor?url=' + item.href;
                              })
                              */
                             var contrib=Math.round(parseFloat(self.props.eth_contrib)*eth1_amount);
                             //alert(contrib);
                              this.contracts[smartNode].methods.upsertItem(this.props.idata.address, self.state.url).send( 
                                {from: drizzleState.accounts[0],  value: contrib, gasPrice:23000000000
                                })
                                .then(function(val)  {
                                  //alert(val);
                                  //self.setState({loading:false})

                                  item.href=self.state.url;
                                  window.location='/iotpedia/editor?url=' + item.href;
    
                                }).catch(function(error) {
                                  alert("Could not complete transaction")
                                  alert(error);
                                  console.log(error);
                                });
                                //  graphAddr=web3.toChecksumAddress(graphAddr)
                                //tx=smartNode.transact({ 'from': address, 'value':contrib * 3 }).upsertItem(graphAddr, href)
                                //var item=self.state.idata;
                                //var href=$('#' + item.id + "_new_url").val();
                                //item.href=href;
                                //item.item_href=href;
                                //self.props.refreshCatalogue(item);
                                //self.setState({idata:item, mode:'itemView', hideAddItem:true});
                                //self.save_item(item.node_href,href,  item[this.props.catalogueType]);
                            }}>Save</button>
                </div>
            </div>
            );
  } 

  if(!this.props.contracts[this.props.contract] 
    || !this.props.contracts[this.props.contract].initialized 
    || !this.props.contracts[this.props.contract].synced
  ) 
  {
      return (
        <span>🔄</span>
      )
  }

    
    if (this.state.mode == 'metaEdit') {
      var key1='rel'
      var key2='val'
      var valLoading='';
      var relLoading='';
      var bal='🔄';
      var mdata=this.state.mdata;



      var props=this.props;
      var context=this.context;
      
      var dataKey={};
      if (this.state.loading && this.state.mode == 'metaEdit') {
      
         var methodArgs = [];
         dataKey['rel'] = this.contracts[this.props.contract].methods["rel"].cacheCall(...methodArgs)
         
         dataKey['val'] = this.contracts[this.props.contract].methods["val"].cacheCall(...methodArgs)
       
         this.setState({dataKey:dataKey, loading:false})
  
      }

      if (!(dataKey[key1] in this.props.contracts[this.props.contract][key1])) {
          relLoading=<span>🔄</span>;

      } else if (this.props.contracts[this.props.contract][key1][dataKey[key1]].error) {
          relLoading=<span>{this.props.contracts[this.props.contract][key1][this.dataKey].error}</span>;
          //return (
          //  <span>🔄</span>
          //)
        } else {
          relLoading=''
          if (mdata.rel!=this.props.contracts[this.props.contract][key1][dataKey[key1]].value) {
          
            mdata.rel=this.props.contracts[this.props.contract][key1][dataKey[key1]].value

            //this.setState({mdata:mdata})
          }
        }
        

        if (!(dataKey[key2] in this.props.contracts[this.props.contract][key2])) {
          valLoading=<span>🔄</span>;

        } else if (this.props.contracts[this.props.contract][key2][dataKey[key2]].error) {
          valLoading=<span>{this.props.contracts[this.props.contract][key2][dataKey[key2]].error}</span>;
          //return (
          //  <span>🔄</span>
          //) 
        } else {
          valLoading=''
          if (mdata.val != this.props.contracts[this.props.contract][key2][dataKey[key2]].value) {
            
            mdata.val=this.props.contracts[this.props.contract][key2][dataKey[key2]].value
            
            //this.setState({mdata:mdata})
          }
        }

      //}

      if (this.state.mode == 'metaEdit') {
          return <li>
            
                    {mdata.rel}:<br/>
                    <div className={"input-group"}>
                        <textarea className={"form-control"} rows={10}
                                                style={{maxWidth:"80%"}}

                            onChange={(e) => {
                              self.setState({formVal:e.target.value});
                              //alert(this.state.formVal);
                            
                            }}
                            defaultValue={mdata.val} />

                      {/*
                  
                        <input className={"form-control"} 
                              type={"text"} 
                              defaultValue={mdata.rel} />
                      <span style={{verticalAlign:"middle"}}>
                          <h1> = </h1>
                      </span>
                        <input className={"form-control"} 
                              type={"text"} 
                              defaultValue={mdata.val} />
                      */}
                      <br/>
                              <button className={"btn btn-primary"} type="button"
                              onClick={() => {
                                var method="setVal";
                                //if (this.state.formVal) {

                                  var contrib=Math.round(parseFloat(self.props.eth_contrib)*eth1_amount);
                                  var formVal=this.state.formVal;
                                  if (!formVal)
                                    formVal='';
                                  var drizzleState=this.context.drizzle.store.getState()
                                  //alert(drizzleState.accounts[0]);
                                  
                                  this.setState({loading:true})

                                  this.contracts[this.props.contract].methods.setVal(formVal).send( 
                                    {from: drizzleState.accounts[0], gasPrice:23000000000
                                    })
                                    .then(function(val)  {
                                      //alert(val);
                                      var mdata=self.state.mdata;
                                      //mdata.rel=self.state.formRel,
                                      mdata.val=self.state.formVal;
                                      self.setState({
                                        loading:false,
                                        mode:'metaView',
                                        mdata: mdata
                                      });

        
                                    }).catch(function(error) {
                                      alert("Could not complete transaction")
                                      alert(error);
                                      console.log(error);
                                    });

                                  
                                  /*
                                  this.contracts[this.props.contract].methods[method].cacheSend(this.state.formVal, {
                                    from: drizzleState.accounts[0]
                                  });
                                  var mdata=this.state.mdata;
                                  mdata.val=this.state.formVal;
                                  this.setState({
                                    mode:'metaView',
                                    mdata: mdata
                                  });
                                  */

                                //}

                                
                                  /*
                                  self.save_meta(
                                              mdata.rel,
                                              mdata.val,
                                              mdata.node_href, 
                                              mdata.item_href);
                                  this.setState({
                                      mode:'view',
                                      mdata: mdata
                                  });
                                  */

                              }}> Save </button>
                          </div>
                  </li>
      } 
      
    }
    return (
      <form className="pure-form pure-form-stacked">
        {this.inputs.map((input, index) => {            
            var inputType = this.translateType(input.type)
            var inputLabel = this.props.labels ? this.props.labels[index] : input.name
            // check if input type is struct and if so loop out struct fields as well
            return (<input key={input.name} type={inputType} name={input.name} value={this.state[input.name]} placeholder={inputLabel} onChange={this.handleInputChange} />)
        })}
        <button key="submit" className="pure-button" type="button" onClick={this.handleSubmit}>Submit</button>
      </form>
    )
  }
}

ContractForm.contextTypes = {
  drizzle: PropTypes.object
}

/*
 * Export connected component.
 */



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




export default connect( stateToProps, dispatchToProps)( drizzleConnect(ContractForm,drizzleStateToProps, drizzleDispatchToProps))

//export default drizzleConnect(ContractForm, mapStateToProps,  drizzleDispatchToProps)