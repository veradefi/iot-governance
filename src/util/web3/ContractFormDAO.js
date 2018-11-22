import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as web3Utils from "../../util/web3/web3Utils";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import Autocomplete from 'react-toolbox/lib/autocomplete';
import ContractDAO from './ContractDAO'
import {Button} from 'react-toolbox/lib/button';

var eth1_amount=1000000000000000000;

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

class ContractFormDAO extends Component {
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
    item:PropTypes.object,
    addContract:PropTypes.func.isRequired,
    contracts:PropTypes.object.isRequired,
    accounts:PropTypes.object.isRequired,
    procMetaAdd2:PropTypes.func
};

  constructor(props, context) {
    super(props);
    


    this.state={proploading:true}
  }

  componentDidMount() {
    var props=this.props;
    var context=this.context;

    


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

  saveLocation=(lat, lng) => {
    var self=this;
     
     var lat_rel="http://www.w3.org/2003/01/geo/wgs84_pos#lat"
     var lng_rel="http://www.w3.org/2003/01/geo/wgs84_pos#long"

     var method="upsertMetaData";
     if (lat && lng) {
            var drizzleState=this.context.drizzle.store.getState()
            //alert(drizzleState.accounts[0]);
            //alert(this.props.eth_contrib)
            this.setState({loading:true})

            //var contrib=Math.round(parseFloat(self.props.eth_contrib/2)*eth1_amount);
            //alert(contrib);
            this.contracts[self.props.contract].methods.upsertMetaData(lat_rel, lat).send( 
                {from: drizzleState.accounts[0],  gasPrice:1000000000
                })
                .then(function(val)  {
                //alert(val);
                self.contracts[self.props.contract].methods.upsertMetaData(lng_rel, lng).send( 
                    {from: drizzleState.accounts[0],  gasPrice:1000000000
                    })
                    .then(function(val)  {
                            self.setState({
                                loading:false,
                                //mode:'metaView',
                                lat:lat,
                                lng:lng,
                                lat_rel:lat_rel,
                                lng_rel:lng_rel
                            });
                    }).catch(function(error) {
                        alert("Could not complete transaction")
                        alert(error);
                        console.log(error);
                    });

                }).catch(function(error) {
                alert("Could not complete transaction")
                alert(error);
                console.log(error);
                });
     }                
     
  }

  getContract = () => {
    var context=this.context;
    var props=this.props;
    this.contracts = context.drizzle.contracts
    
    if (this.contracts) {
     

      if (props.metaEdit || props.metaView) {

            var cfg=Object.assign({}, web3Utils.get_meta_contract_cfg(props.contract));
            var events=[];
            var web3=web3Utils.get_web3();
            var drizzle=context.drizzle;
            //this.setState({loading:false})
            //context.drizzle.addContract({cfg, events})
            
            if (!(props.contract in context.drizzle.contracts))
              props.addContract(drizzle, cfg, events, web3) 
          
      }
      if (props.metaAdd || props.metaAdd2) {
        var cfg=Object.assign({}, web3Utils.get_item_contract_cfg(props.contract));
        var events=[];
        var web3=web3Utils.get_web3();
        var drizzle=context.drizzle;
        //this.setState({loading:false})
        //context.drizzle.addContract({cfg, events})
        
        if (!(props.contract in context.drizzle.contracts))
          props.addContract(drizzle, cfg, events, web3) 
      }

      var url='';
      if (props.catAdd || props.mapEdit) {
        var cfg=Object.assign({}, web3Utils.get_item_contract_cfg(props.contract));
        var events=[];
        var web3=web3Utils.get_web3();
        var drizzle=context.drizzle;
        //this.setState({loading:false})
        //context.drizzle.addContract({cfg, events})
        if (props.idata && props.idata.href) {
            url=props.idata.href;
        }
        if (!(props.contract in context.drizzle.contracts))
          props.addContract(drizzle, cfg, events, web3) 
      }
    }
 
    var mode='metaView'
    if (props.metaEdit) {
      mode = 'metaEdit'
    }
    if (props.metaAdd) {
      mode='metaAdd'
    }
    if (props.metaAdd2) {
      mode='metaAdd2'
    }
    if (props.catAdd) {
      mode='catAdd'
    }
    if (props.mapEdit) {
      mode='mapEdit'
    }

    this.setState({
      proploading:false,

      mode:mode,
      mdata:props.mdata,
      url:url,
      //metaEdit:this.props.metaEdit,
      //dataKey:dataKey,
      //drizzleState: context.drizzle.store.getState(),
      //initialState:initialState,
    });
  }
  render() {
    var self=this;
    var mdata=this.state.mdata;
    var eth1_amount=1000000000000000000;

    
  

    var res=[];
    if (this.state.proploading) {
      this.getContract();
    }

    

    if(!this.props ||
      !this.props.contracts ||
      !(this.props.contract in this.props.contracts) ||
        !this.props.contracts[this.props.contract].initialized) {
      return (
        <span>🔄</span>
      )
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

    
    if (this.state.loading) {
      return (
          <li>
              <b>Processing Contribution & Granting IOTBLOCK Tokens... Please Confirm Gas Contribution<br/></b>
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
                {mdata.rel} <pre style={{width:"88%", whiteSpace: "pre-wrap" }}>{mdata.val}</pre>

                <br/>
                {self.state.dataLoading ? (
                    <b>Processing Contribution... <br/></b>
                ) : mdata.address ?
                <span><b>Earned <ContractDAO contract={"SmartKey"} 
                            method="getBalance" 
                            methodArgs={[mdata.address]} 
                            isLocaleString={true} /> &nbsp;
                  IOTBLOCK </b></span> : null}
                
                
                <br/>
        </li>
    }

    if (this.state.mode == 'metaAdd') {
                return (
                  <li>
                          [<span style={{'cursor':'pointer'}}
                              onClick={() => {
                                  //this.setState({mode:'metaAdd2'})
                                  
                                  this.props.procMetaAdd2();
                                  }}> 
                          Add Meta Data 
                          </span>] 
              <br/><br/>
              
              </li>
              )
    }

    if (this.state.mode == 'metaAdd2') {
      return <div>
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
                 
                    <textarea className={"form-control"} rows={5}

                                                style={{maxWidth:"100%"}}
                                                onChange={(e) => {
                                                  mdata.val=e.target.value;
                                                  self.setState({formVal:e.target.value, mdata});
                                                  //alert(this.state.formVal);
                                                
                                                }}
                            value={mdata.val} />

                    <br/>
                          <button className={"btn btn-primary"} type="button"
                          onClick={() => {
                              
                            var method="upsertMetaData";
                            if (this.state.formVal && this.state.formRel) {
                                  var drizzleState=this.context.drizzle.store.getState()
                                  //alert(drizzleState.accounts[0]);
                                  //alert(this.props.eth_contrib)
                                  this.setState({loading:true})

                                  //var contrib=Math.round(parseFloat(self.props.eth_contrib)*eth1_amount);
                                  //alert(contrib);
                                  //contrib=0.0001 * eth1_amount;
                                  //alert(contrib)
                                  //alert(this.state.formRel)
                                  //alert(this.state.formVal)
                                  //alert(self.props.contract)
                                  //console.log(this.contracts)
                                  this.contracts[self.props.contract].methods.upsertMetaData(self.state.formRel, self.state.formVal).send( 
                                     {from: drizzleState.accounts[0], gasPrice: 5000000000
                                     })
                                     .then(function(address)  {
                                       //alert(val);
                                       var mdata=self.state.mdata;
                                       //mdata.address=address;
                                       mdata.rel=self.state.formRel,
                                       mdata.val=self.state.formVal;
                                       console.log(mdata);
                                       self.setState({
                                         loading:false,
                                         mode:'metaView',
                                         mdata: mdata
                                       });
                                       self.props.refreshCatalogue();
                                       
         
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

                          }}> <b>Save</b> </button>
              </div>
              <br/>
              <Button style={{width:"100%"}} raised primary onClick={() => {
                                            self.props.closeDialog2();
                                        }}>Cancel</Button> 
           </div>
  } 

  if (this.state.mode == 'catAdd') { 
        var item=this.props.idata;
        var url = this.state.url;
        if (!url) {
          url=item.href ? item.href : item.node_href + '/<catalogue_name>';
        }
        console.log(item);
        return (
      
            <div key={item.id + "_add"}>
                <div style={{textAlign:'left'}}><b>Add to Catalogue</b></div>
                <div  className={"input-group"}>
                <textarea className={"form-control"} type={"text"} id={item.id + "_new_url"} 
                    value={url}
                    onChange={(e) => {
                    self.setState({url:e.target.value});
                    //alert(url);
                  }}/>
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
                             //var contrib=Math.round(parseFloat(self.props.eth_contrib)*eth1_amount);
                             //alert(contrib);
                              this.contracts[smartNode].methods.upsertItem(this.props.idata.address, self.state.url).send( 
                                {from: drizzleState.accounts[0], gasPrice: 1000000000
                                })
                                .then(function(val)  {
                                  //alert(val);
                                  //self.setState({loading:false})

                                  item.href=self.state.url;
                                  window.location='/iotpedia/editor?auth=1&url=' + item.href;
    
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
                <br/>
                <center><b><font color='orange'>1GWei Gas / Transaction</font></b></center>
            </div>
            );
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
                              mdata.val=e.target.value
                              self.setState({formVal:e.target.value, mdata});
                              //alert(this.state.formVal);
                            
                            }}
                            value={mdata.val} />

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
                                //if (this.state.formVal) {
                                  //alert(self.state.mdata.contract_address);
                                  var contract_address=self.state.mdata.contract_address;
                                  //var contrib=Math.round(parseFloat(self.props.eth_contrib)*eth1_amount);
                                  var formVal=this.state.formVal;
                                  var formRel=mdata.rel;
                                  if (!formVal)
                                    formVal='';
                                  var drizzleState=this.context.drizzle.store.getState()
                                  //alert(drizzleState.accounts[0]);
                                  
                                  this.setState({loading:true})

                                  this.contracts[contract_address].methods.upsertMetaData(formRel, formVal).send( 
                                    {from: drizzleState.accounts[0],  gasPrice:1000000000
                                    })
                                    .then(function(val)  {
                                      //alert(val);
                                      var mdata=self.state.mdata;
                                      mdata.rel=mdata.rel,
                                      mdata.val=self.state.formVal;

                                      var web3=web3Utils.get_web3();
                                      self.contracts["SmartKey"].methods.getBalance(self.props.contract).call({from: drizzleState.accounts[0]}).then(function (eth_amount) {
                                        //alert(eth_amount);
                                        var amt=parseFloat(eth_amount);
                                        mdata.bal=amt;
                                        self.setState({
                                          loading:false,
                                          mode:'metaView',
                                          mdata: mdata
                                        });
  

                                      });


                                    
        
                                    }).catch(function(error) {
                                      alert("Could not complete transaction")
                                      alert(error);
                                      console.log(error);
                                    });

                                    /*
                                    var method="setVal";
                                
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
                                    */
                                  
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
    if (this.state.mode == 'mapEdit') {
      return <div className={"row"} id={"location_map"}>
          <div className={"col-md-12"}>
             
              <div className={"input-group"}>
                  <input  className={"form-control"} 
                          type={"text"} 
                          id={"lat"} 
                          value={"http://www.w3.org/2003/01/geo/wgs84_pos#lat"}
                          readOnly={true} />
                  <span style={{verticalAlign:"middle"}}><h1> = </h1></span>
      
                  <input  className={"form-control"} 
                          type={"text"} 
                          id={"lat"} 
                          value={self.props.lat}
                          onChange={(e) => {
                              var val=e.target.value;
                              self.props.setLat(val);
                          }}
                          />   
              </div>                  
              <div className={"input-group"}>
                  <input  className={"form-control"} 
                          type={"text"}
                          id={"long_name"}
                          readOnly={true} 
                          value={"http://www.w3.org/2003/01/geo/wgs84_pos#long"} />

                  <span style={{verticalAlign:"middle"}}><h1> = </h1></span>
                  <input  className={"form-control"} 
                          type={"text"} 
                          id={"lng"} 
                          onChange={(e) => {
                              var val=e.target.value;
                              self.props.setLng(val);
                          }}
                          value={self.props.lng} />   
              </div>
              <center>
                  <button className={"btn btn-primary"} 
                          type={"button"} 
                          onClick={() =>{
                              self.saveLocation(self.props.lat.toString(), self.props.lng.toString());
                          }}>
                          Save Location
                  </button>
                  <br/>
                  <br/>
              </center>

          </div>
      </div>
    }
    
    return (
      <span>Loading...</span>
    )
  }
}

ContractFormDAO.contextTypes = {
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
      showDialog2: (show, content) => {
          dispatch(actions.showDialog2(show, content));
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

export default connect( stateToProps, dispatchToProps)( drizzleConnect(ContractFormDAO,drizzleStateToProps, drizzleDispatchToProps))

//export default drizzleConnect(ContractForm, mapStateToProps,  drizzleDispatchToProps)