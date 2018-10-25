import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as web3Utils from "../../util/web3/web3Utils";
import * as actions from "../../store/actions";
//import MetaData from "..//MetaDataDAO"
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
    }
 
    var mode='metaView'
    if (this.props.metaEdit) {
      mode = 'metaEdit'
    }
    if (this.props.metaAdd) {
      mode='metaAdd'
    }

    this.state={
      loading:true,
      mode:mode,
      mdata:props.mdata,
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
      return <div>
              <li><div className={"input-group"}>

                     <textarea className={"form-control"} rows={10}
                                                style={{maxWidth:"40%"}}

                            defaultValue={mdata.rel} />

                    <span style={{verticalAlign:"middle"}}>
                        <br/><br/>
                        <br/><br/>
                        
                        <h1> = </h1>
                    </span>
                    <textarea className={"form-control"} rows={10}
                                                style={{maxWidth:"40%"}}

                            defaultValue={mdata.val} />

                    <br/>
                          <button className={"btn btn-primary"} type="button"
                          onClick={() => {
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
          </div>
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
          return <div className={"input-group"}>

                    <textarea className={"form-control"} rows={10}
                                                style={{maxWidth:"40%"}}

                            defaultValue={mdata.rel} />

                    <span style={{verticalAlign:"middle"}}>
                        <br/><br/>
                        <br/><br/>
                        
                        <h1> = </h1>
                    </span>
                    <textarea className={"form-control"} rows={10}
                                                style={{maxWidth:"40%"}}

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

const mapStateToProps = state => {
  return {
    contracts: state.contracts
  }
}



const drizzleDispatchToProps = dispatch => {
  return {
      addContract: (drizzle, poolcfg, events, web3) => {
          dispatch(actions.addContract(drizzle, poolcfg, events, web3));
      },
  };
};



export default drizzleConnect(ContractForm, mapStateToProps,  drizzleDispatchToProps)