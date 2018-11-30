import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as web3Utils from "../../util/web3/web3Utils";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import Autocomplete from 'react-toolbox/lib/autocomplete';
import ContractDAO from './ContractDAO'
import {Button} from 'react-toolbox/lib/button';
import Geolocation from 'react-geolocation';
import Checkbox from 'react-toolbox/lib/checkbox';
import MapDataDAO from "../../layouts/Browser/MapDataDAO";

var QRCode = require('qrcode.react');
var eth1_amount=1000000000000000000;

const source = {

  'urn:X-hypercat:rels:isContentType': 'urn:X-hypercat:rels:isContentType',

  'urn:X-hypercat:rels:supportsSearch': 'urn:X-hypercat:rels:supportsSearch',

  'urn:X-hypercat:rels:hasDescription': 'urn:Xhypercat:rels:hasDescription',

  'urn:X-hypercat:rels:hasBrand': 'urn:Xhypercat:rels:hasBrand',

  'urn:X-hypercat:rels:hasName': 'urn:Xhypercat:rels:hasName',

  'urn:X-hypercat:rels:hasItemID': 'urn:Xhypercat:rels:hasItemID',

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

  'urn:X-hypercat:rels:hasBrand',

  'urn:X-hypercat:rels:hasName',

  'urn:X-hypercat:rels:hasItemID',

  'urn:X-hypercat:rels:hasDescription',

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

    showDeviceUI:PropTypes.bool,

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



  getItemContract = (address) => {

    var context=this.context;

    var props=this.props;

    this.contracts = context.drizzle.contracts

    

    var cfg=Object.assign({}, web3Utils.get_item_contract_cfg(address));

    var events=[  ];

    var web3=web3Utils.get_web3();

    var drizzle=context.drizzle;

    //this.setState({loading:false})

    //context.drizzle.addContract({cfg, events})

    

    if (!(address in context.drizzle.contracts))

      props.addContract(drizzle, cfg, events, web3) 

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

              <b>{this.state.loadingMessage ? this.state.loadingMessage : "Processing Contribution & Granting IOTBLOCK Tokens..."} <br/></b>

          </li>

      )

   }



   if (this.state.addSuccess) {

  

      return <div>

     

                <center>

                <QRCode value={this.state.itemName} /><br/>

                <h3>{this.state.itemName}</h3>

                <br/>



                </center>

                <a href={this.state.next}>

                <center><h3>Catalogue Added!</h3></center>

                </a>

                <br/>

                {/*

                <Button label='View / Contribute Item Details' raised primary 

                                style={{width:"100%"}}

                                onClick={() => {

                                  window.location=self.state.next;

                                }}

                                />

                              */}



                </div>

   }

    if (this.state.mode == 'metaView') {

      return <li>

                [&nbsp; <a 

                    href={'JavaScript:'}

                    onClick={() => {

                        this.setState({mode:'metaEdit'});

                    }}> 

                    Edit 

                  </a> 
                &nbsp;
                ]&nbsp;
                {mdata.address ? <span>[ <a 

                href={'JavaScript:'}

                onClick={() => {

                    self.props.showDialog2(true, 
                      <div style={{ height: window.innerHeight * 0.9,
                        overflowY: "auto" }}>
                        <center><h3>Metadata Values History</h3></center>
                        <center><b>{mdata.rel}</b></center>
                        <div>Latest Revision: <pre>{mdata.val}</pre></div>
                      <ContractDAO contract={mdata.address} 
                                                    method="getValHistoryCount"
                                                    methodArgs={[]}
                                                    //method="decimals"
                                                    value_post_process={(val)=> {
                                                        var items=[];
                                                        for (var i=val -1; i>= 0; i--) {
                                                            var idx=i;
                                                            
                                                            items.push(<ContractDAO key={idx} contract={mdata.address} 
                                                            method="val_history" 
                                                            methodArgs={[idx]}
                                                            value_methodArgs_post_process={(value, methodArgs)=> {
                                                                    return <div>Revision {parseInt(methodArgs[0]) + 1}: <pre>{value}</pre></div>;
                                                                }}
                                                            />);
                                                        }
                                                        return items;
                                                    }
                                                }
                                                    />
                                                    <br/>
                            <Button style={{width:"100%"}} raised primary onClick={() => {
                                self.props.closeDialog2();
                            }}>Close</Button> 

                      </div>
                      )

                }}> 

                View Revision History

                </a> 

                 &nbsp;]</span>
                : null} <br/>

                <b>{mdata.rel}</b><br/> <pre style={{width:"88%", whiteSpace: "pre-wrap" }}>{mdata.val}</pre>



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

        if (this.props.showDeviceUI) {

          return (

      

            <div key={item.id + "_add"}>

                <div style={{textAlign:'center'}}><h3>Add Item to Catalogue</h3></div>

                <br/>

                <input 

                      className={ "form-control" } 

                      style={{ height:"50px", width:"100%" }} 

                      type="text" 

                      value={this.state.deviceName}

                      onChange={(e) => {

                        self.setState({deviceName:e.target.value})

                      }}

                      placeholder="Name" /> <br/>

                <input  

                    className={ "form-control" } 

                    style={{ height:"50px", width:"100%" }} 

                    type="text" placeholder="Brand / Entity" 

                    value={this.state.deviceBrand}

                    onChange={(e) => {

                      self.setState({deviceBrand:e.target.value})

                    }}



                    /> <br/>

                

                    <button className={"form-control btn btn-primary"} 

                             style={{ height:"50px", width:"100%" }} 

                             type={"button"} 

                             onClick={() => {

                              this.setState({loading:true,loadingMessage:'Adding Catalogue & Granting IOTBLOCK Tokens... Please Confirm Transaction...'})

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

                                {from: drizzleState.accounts[0], gasPrice: 10000000000

                                })

                                .then(function(val)  {

                                  self.contracts[self.props.idata.address].methods.getItem(self.state.url).call().

                                    then(function(contract_address) {

                                      self.getItemContract(contract_address);



                                      setTimeout(() => {

                                        self.setState({loading:true,loadingMessage:'Adding ID Metadata... Please Confirm Transaction...'})

                                        self.contracts[contract_address].methods.upsertMetaData(

                                          "urn:X-hypercat:rels:hasItemID",

                                          self.props.showDeviceUI).send( 

                                          {from: drizzleState.accounts[0],  gasPrice:1000000000

                                          })

                                          .then(function(val)  {

  

                                          self.setState({loading:true,loadingMessage:'Adding Name Metadata... Please Confirm Transaction...'})

                                          self.contracts[contract_address].methods.upsertMetaData(

                                            "urn:X-hypercat:rels:hasBrand",

                                            self.state.deviceName).send( 

                                            {from: drizzleState.accounts[0],  gasPrice:1000000000

                                            })

                                            .then(function(val)  {

                                              self.setState({loading:true,loadingMessage:'Adding Brand Metadata... Please Confirm Transaction...'})

                                              self.contracts[contract_address].methods.upsertMetaData(

                                                "urn:X-hypercat:rels:hasName",

                                                self.state.deviceBrand).send( 

                                                {from: drizzleState.accounts[0],  gasPrice:1000000000

                                                })

                                                .then(function(val)  {

            

                                                      //alert(val);

                                                      item.href=self.state.url;

                                                      //window.location='/iotpedia/editor?auth=1&url=' + item.href;

                                                      self.setState({loading:false, 

                                                        addSuccess:true, 

                                                        itemName:self.props.showDeviceUI, 

                                                        next: '/iotpedia/editor?auth=1&url=' + item.href})

        

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

        

                                            }).catch(function(error) {

                                              alert("Could not complete transaction")

                                              alert(error);

                                              console.log(error);

                                            });

  

                                      }, 3000);

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

                                //  graphAddr=web3.toChecksumAddress(graphAddr)

                                //tx=smartNode.transact({ 'from': address, 'value':contrib * 3 }).upsertItem(graphAddr, href)

                                //var item=self.state.idata;

                                //var href=$('#' + item.id + "_new_url").val();

                                //item.href=href;

                                //item.item_href=href;

                                //self.props.refreshCatalogue(item);

                                //self.setState({idata:item, mode:'itemView', hideAddItem:true});

                                //self.save_item(item.node_href,href,  item[this.props.catalogueType]);

                            }}><h3>Save</h3></button>

                <br/>

            </div>

            );



        }

        return (

      

            <div key={item.id + "_add"}>

                <div style={{textAlign:'center'}}><h3>Add Item to Catalogue</h3></div>

                <br/>

                <div  className={"input-group"}>

                <textarea className={"form-control"} type={"text"} id={item.id + "_new_url"} 

                    value={url}

                    onChange={(e) => {

                    self.setState({url:e.target.value});

                    //alert(url);

                  }}/>

                </div><br/>

                    <button className={"form-control btn btn-primary"} type={"button"} 

                            style={{ height:"50px", width:"100%" }} 

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

                                {from: drizzleState.accounts[0], gasPrice: 10000000000

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

                            }}><h3>Save</h3></button>

                <br/>

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

              <div className="row">
                    <div className="col-md-6">
                    
              <Geolocation

                render={({

                  fetchingPosition,

                  position: { coords: { latitude, longitude } = {} } = {},

                  error,

                  getCurrentPosition

                }) =>

                  <div>

                    {error &&

                      <div>

                        {error.message}

                      </div>}

                    <Checkbox

                      checked={this.state.useLocation}

                      label="Use Current Position"

                      onChange={(value) => {

                        if (value) {

                          self.props.setLat(latitude);

                          self.props.setLng(longitude);                      

                          self.setState({useLocation:true});

    

                        } else {

                          self.setState({useLocation:false});

                        }

                      }}

                    />

                  </div>}

              />
                </div>
                <div className={"col-md-6"} align={"right"}>
                <span>[ <a 

                    href={'JavaScript:'}

                    onClick={() => {
                        var mdata=self.props.mdata;
                        self.props.showDialog2(true, 
                          <div style={{ height: window.innerHeight * 0.9,
                            overflowY: "auto" }}>
                            <center><h3>Metadata Values History</h3></center>
                            <center><b>{mdata.rel}</b></center>
                            <table style={{width:"100%"}}><thead><tr><td>
                            {mdata.LatitudeData && mdata.LatitudeData.address ?
                            <b>{mdata.LatitudeData.rel}</b> : null}
                              </td><td>
                              {mdata.LongitudeData && mdata.LongitudeData.address ?
                            <b>{mdata.LongitudeData.rel}</b> : null}

                                </td></tr>
                              </thead>
                              <tbody>
                                <tr><td>

                                  <div>Latest Revision: <pre>{mdata.lat}</pre></div>
                            
                                </td>
                                <td>
                                <div>Latest Revision: <pre>{mdata.lng}</pre></div>
                            
                                </td>
                                </tr>
                                <tr><td colSpan={2}>
                                <MapDataDAO 
                                contract={this.props.contract} 
                                lat={mdata.lat} 
                                lng={mdata.lng} 
                                mdata={mdata} 
                                viewOnly={true}
                                />
                                </td></tr>
                            {mdata.LatitudeData && mdata.LatitudeData.address ?
                          <ContractDAO contract={mdata.LatitudeData.address} 
                                                        method="getValHistoryCount"
                                                        methodArgs={[]}
                                                        //method="decimals"
                                                        value_post_process={(val)=> {
                                                            var items=[];
                                                            for (var i=val -1; i>= 0; i--) {
                                                                var idx=i;
                                                                
                                                                items.push(<ContractDAO key={idx} 
                                                                  contract={mdata.LatitudeData.address} 
                                                                method="val_history" 
                                                                methodArgs={[idx]}
                                                                methodArgsAdd={[mdata.LongitudeData.address, mdata]}
                                                                value_methodArgs_post_process={(value, methodArgs, methodArgsAdd)=> {
                                                                          return <ContractDAO 
                                                                            key={Math.random()} 
                                                                            contract={methodArgsAdd[0]} 
                                                                            method="val_history" 
                                                                            methodArgs={[methodArgs[0]]}
                                                                            methodArgsAdd={[value, methodArgsAdd[1]]}
                                                                            value_methodArgs_post_process={(value2, methodArgs2, methodArgsAdd2)=> {
                                                                                    var res=[];
                                                                                    res.push(<tr key={Math.random()}>
                                                                                      <td>
                                                                                      <div>Revision {parseInt(methodArgs2[0]) + 1}: 
                                                                                      <pre>{methodArgsAdd2[0]}</pre></div>
                                                                                      </td><td>
                                                                                      <div>Revision {parseInt(methodArgs2[0]) + 1}: 
                                                                                      <pre>{value2}</pre></div>
                                                                                      </td>
                                                                                      </tr>);
                                                                                    res.push(<tr key={Math.random()}>
                                                                                    <td colSpan={2}>
                                                                                    <MapDataDAO 
                                                                                      contract={methodArgsAdd2[1].contract_address}
                                                                                      lat={methodArgsAdd2[0]} 
                                                                                      lng={value2} 
                                                                                      mdata={methodArgsAdd2[1]} 
                                                                                      viewOnly={true}
                                                                                      />
                                                                                    </td></tr>
                                                                                    );
                                                                                    return res;
                                                                                      
                                                                                  }}
                                                                            />
                                                                            
                                                                    }}
                                                                />);
                                                            }
                                                            return items;
                                                        }
                                                    }
                                                        /> : null}
                              </tbody></table>
                                                        <br/>
                                <Button style={{width:"100%"}} raised primary onClick={() => {
                                    self.props.closeDialog2();
                                }}>Close</Button> 

                          </div>
                          )

                    }}> 

                    View Revision History

                    </a> 

                    &nbsp;]</span>
                </div>

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
