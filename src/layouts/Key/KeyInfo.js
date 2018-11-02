import React, { Component } from 'react'
import KeyHealth from "./KeyHealth";
import * as web3Utils from "../../util/web3/web3Utils";

import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import ContractDAO from '../../util/web3/ContractDAO'
import AccountDAO from '../../util/web3/AccountDAO'
import { drizzleConnect } from 'drizzle-react'

var $ = require ('jquery');
var eth1_amount=1000000000000000000;


class KeyInfo extends Component {
    static propTypes = {
        showDialog:PropTypes.func.isRequired,
        closeDialog:PropTypes.func.isRequired,
        api_auth: PropTypes.string.isRequired,
        api_key: PropTypes.string.isRequired,
        eth_contrib: PropTypes.number.isRequired,
        isAuthenticated: PropTypes.bool.isRequired,
    };
  
  /**
   * Creates an instance of KeyInfo
   * @constructor
   * @param {any} props
   * @memberof KeyInfo
   */

  constructor(props, context) {
    super(props);

    this.drizzleState=context.drizzle.store.getState()
    this.contracts = context.drizzle.contracts

    this.state = {
        loading:true,
        transferAmt:0.1,
        keyInfo:props.keyInfo,
        
    };
    this._isMounted = false;
  }

    
showHealthDialog = () => {
    this.setState({health_init:true});
    var amt=$('#eth_contrib').val();
    $('.donate_amt').html(amt);
    this.props.showDialog(true, <KeyHealth account={this.props.myAddress} donate_amt={amt} setHealth={this.setHealth_drizzle} />);
    
}

hideHealthDialog = () => {
       this.props.closeDialog();
}

get_api_key = () => {
    var self=this;
    //alert(myAddress.toLowerCase());
    //$('#view_api').hide();
    $('#view_api_loading').show();
    web3Utils.get_keyAuth(this.props.myAddress.toLowerCase(), self.fill_api_info);
     
}

generate_api_key = () => {
    var self=this;
    $('#replace_api').hide();
    $('#replace_api_loading').show();
    var username=$('#username').val();
    var password=$('#password').val();
    var auth_key=self.props.myAddress + ":" + username + ":" + password;
    auth_key=auth_key.toLowerCase()

    web3Utils.add_keyAuth(self.props.myAddress.toLowerCase(), self.props.myAddress.toLowerCase(), auth_key, self.fill_new_api_info) 
     
}


fill_api_info = (auth, auth_info) => {
    var self=this;
    $('#view_api').show();
    $('#view_api_loading').hide();
    //$('#new_api_key').show();
    //$('.auth').html(auth);
    var eth1=1000000000000000000;
    var eth_contrib=parseFloat($('#eth_contrib').val()) * eth1;
    var api_key=auth_info;
    var api_auth=auth;

    var data="Token api_key=\"" + api_key + "\" auth=\"" + api_auth + "\" eth_contrib=\"" + eth_contrib + "\"";
    data=btoa(data);
    data=btoa(data + ':' + '');
    //$('.auth_key').html(data);
    this.props.showDialog(true, (
        <div className={"row"}>
            <div className={"col-md-12"}>
                    
                    <center>
                    <label className={"title2"}>Authorization API KEY </label>
                    </center>
                    <center>
                    <textarea className={"auth_key"} id={'auth_api_key'}  style={{width:"100%", height:"100px",textAlign:'left', background:'white'}} 
                    value={data} onChange={() => {}}/>
                    </center>
                    <br/>
                    <center>
                    <div className={"input-group"}>
                        <button   
                            onClick={() => {
                                var txt=document.getElementById('auth_api_key');
                                txt.focus();
                                txt.select();
                                document.execCommand('copy')

                            }}  
                            style={{ width: "50%" }}
                        className={"div-control button3 btn btn-primary"} 
                        type={"button"} 
                        >
                        <span className={"buttonText"}>Copy</span>
                        </button>
                        <a href="#auth" onClick={() => {
                            self.props.closeDialog();
                        }}
                        style={{ width: "50%" }}
                        className={"div-control button3 btn btn-primary"} >
                        <span className={"buttonText"}>Close</span></a>

                    </div>
                    </center>
            </div>
            <div className={"col-md-2"}>
            </div>
        </div>

    ))
    this.setState({
        api_key:auth_info,
        api_auth:auth   
    });
    


}

fill_new_api_info = (auth, auth_info) => {
    var self=this;
    $('#replace_api').html('New API Key Generated');
    $('#replace_api_loading').hide();
    $('#new_api_key').show();
    self.fill_api_info(auth, auth_info);        
}

get_smartkey_transactions = (href, offset, limit) => {
    var self=this;
   $('.loadmore').hide();
   $.ajax({
            beforeSend: function(xhr){
                self.props.add_auth(xhr);
            },
            type: 'GET',
            url: '/cat/getSmartKeyTx?address=' + encodeURI(self.props.myAddress) + '&offset=' + encodeURI(offset) + '&limit=' + encodeURI(limit),
            //data: JSON.stringify(user_item),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(body, textStatus, xhr) {
                if (parseInt(offset) == 0) {
                    $('#transactions').html('');
                }
                var transactions=body["transactions"];
                if (self.state.transactions && offset > 0) {
                    transactions=[...self.state.transactions, ...transactions];
                }
                var count=parseInt(body["count"]);
                var txParams={href, offset, limit}
                self.setState({transactions:transactions, transactionCount:count, transactionParams:txParams});
                
            },
            error: function(xhr, textStatus, err) {
                console.log(xhr.status + ' ' + xhr.statusText);
            }
        });
}

fill_page2_transactions = (sender, date, amount, tx_type) => {
        console.log(sender, date, amount);
        var dateIdx=date;
        var dateTime = new Date(parseInt(date) * 1000);
        date=dateTime.toISOString(); 
        var eth1=1000000000000000000;
        var tx='Incoming';
        if (tx_type > 0) {
            tx='Outgoing';
        }
        var html=[];
        html.push(
        <div key={Math.random()} className={'row label8'}>
            <div className={'col-md-3'}>
                 <b>Date:</b><br/>
                 {date}
            </div>
            <div className={'col-md-5'}>
                 
                    <b>Address:</b><br/>
                    { sender }
            </div><div className={'col-md-2'}>
                   <b>Type:</b><br/> 
                   { tx }
            </div><div className={'col-md-2'}>
                   <b>Amount:</b><br/> 
                   { amount/eth1 } ETH 
            </div>
        </div>);
    
        html.push(<div  key={Math.random()} className={'row'}>
                <div className={'col-xs-12'}>
                    <hr />
                    </div>
            </div>
        );
        
        return html;
        
}
    
fill_page2_transactions_load_more = ()  => {
        var self=this;

        var count=self.state.transactionCount;
        var {href, offset, limit} = self.state.transactionParams;

        
        offset=parseInt(offset)
        offset+=limit;
        if (offset < count) {
            var html = (
            <div  key={Math.random()} className={'row label8 loadmore'}>
                <div className={'col-md-12'}>
                <center>
                    <a href="#transactions" className={"button3 form-control btn btn-primary"} 
                    onClick={() => {
                        self.get_smartkey_transactions(href, offset, limit);
                    }}>
                    <span className={"buttonText"}>Load More</span>
                    </a>

                </center><br/><br/></div>
            </div>
            );
            return html;
        }

}    

get_transfer_user_eth_drizzle = (beneficiary, amount) => {
    var self=this;
    $('#eth_transfer').hide();
    $('#eth_transfer_loading').show();
    var drizzleState=this.context.drizzle.store.getState()
    var smartNode="SmartKey";
        
    var amount=Math.round(parseFloat(amount)*eth1_amount);
    var sender=self.props.myAddress;

    this.contracts[smartNode].methods.transferEth(amount, sender, beneficiary).send(
    {from: drizzleState.accounts[0],  gasPrice:23000000000
    })
    .then(function(address)  {
        $('#eth_transfer').show();
        $('#eth_transfer_loading').hide();

    }).catch(function(error) {
        self.setState({loading:false})
            
        alert("Could not complete transaction")
        alert(error);
        console.log(error);
    });
}

get_transfer_user_eth = (beneficiary, amount)  =>  {
   var self=this;
   var eth1=1000000000000000000;
   var amt=parseFloat(amount) * eth1;
   $('#eth_transfer').hide();
   $('#eth_transfer_loading').show();
   $.ajax({
            beforeSend: function(xhr){
                self.props.add_auth(xhr);
            },
            type: 'GET',
            url: '/cat/transferUserEth?address=' + encodeURI(self.props.myAddress) + '&beneficiary=' + encodeURI(beneficiary) + '&amount=' + encodeURI(amt),
            //data: JSON.stringify(user_item),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(body, textStatus, xhr) {
               $('#eth_transfer').show();
               $('#eth_transfer_loading').hide();
               //self.props.fill_page2(self.props.myAddress, body["address"], body["balance"], body["eth_recv"], body["vault"], body["props"], body["health"], body["tokens"], body["isOwner"]);
            },
            error: function(xhr, textStatus, err) {
               $('#eth_transfer').show();
               $('#eth_transfer_loading').hide();
               console.log(xhr.status + ' ' + xhr.statusText);
            }
        });
}


setHealth_drizzle = (health ) => {
    var self=this;
    self.hideHealthDialog();

    var drizzleState=this.context.drizzle.store.getState()
    var smartNode=self.state.key_addr;
    //print('setHealth',key.transact({ 'from': address, 'value':int(auth['eth_contrib']) }).setHealth(health))
        
    var contrib=Math.round(parseFloat(self.props.eth_contrib)*eth1_amount);

    this.contracts[smartNode].methods.setHealth(health).send(
    {from: drizzleState.accounts[0], value:contrib, gasPrice:23000000000
    })
    .then(function(address)  {
        $('#health').show();
        $('#health_loading').hide();

    }).catch(function(error) {
        $('#health').show();
        $('#health_loading').hide();
        self.hideHealthDialog();
            
        alert("Could not complete transaction")
        alert(error);
        console.log(error);
    });
}


setHealth = (health) => {
   var self=this;
   var health=parseInt(health)
   self.hideHealthDialog();
   $.ajax({
            beforeSend: function(xhr){
                self.props.add_auth(xhr);
            },
            type: 'GET',
            url: '/cat/setUserHealth?address=' + encodeURI(self.props.myAddress) + '&health=' + encodeURI(health),
            //data: JSON.stringify(user_item),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(body, textStatus, xhr) {
               $('#health').show();
               $('#health_loading').hide();
                self.props.fill_page2(self.props.myAddress, body["address"], body["balance"], body["eth_recv"], body["vault"], body["state"], body["health"], body["tokens"],  body["isOwner"]);
            },
            error: function(xhr, textStatus, err) {
               $('#health').show();
               $('#health_loading').hide();
               console.log(xhr.status + ' ' + xhr.statusText);
            }
        });
}

get_keyInfo= (address) => {
    var self=this;
    var cfg=Object.assign({}, web3Utils.get_key_contract_cfg(address));
    var events=[];
    var web3=web3Utils.get_web3();
    var drizzle=this.context.drizzle;
    
    this.props.addContract(drizzle, cfg, events, web3) 
    self.setState({key_addr:address, loading:false});

}
componentDidMount() {
    var self=this;
    var {userAddress, address, balance, eth_recv, vault, state, health, tokens, isOwner, states, healthStates}=this.props.keyInfo;

    //self.get_smartkey_transactions(userAddress,0,10);
    
   this.get_keyInfo(address);
    
    
}

componentWillReceiveProps(newProps) {
    var self=this;
    if (newProps.keyInfo && !(JSON.stringify(newProps.keyInfo) === JSON.stringify(this.props.keyInfo))) {
        this.setState({keyInfo:newProps.keyInfo})
        self.get_keyInfo(this.state.keyInfo.address);
        //self.get_smartkey_transactions(this.state.keyInfo.address,0,10);
    }

}

render() {
    var self=this;
    var {userAddress, address, balance, eth_recv, vault, state, health, tokens, isOwner, states, healthStates}=this.state.keyInfo;
    
   
    if (this.state.loading) {
        var loading=(<div id={"loading"}>
        <img src="/images/wait.gif" />
        </div>)
        return loading;
    }
    return(
      
        <div id={"page2"} style={{ }}>
            <div className={"row"}>
                <div className={"col-md-12"}>    

                </div>
            </div>

            <div className={"row"}>
                <div className={"col-md-12"}>    
                    

                                <div className={"row"}>
                                    <div className={"col-md-12"}>    
                                    <br/>
                                        <center>
                                        <label className={"title2"} style={{paddingTop:"5px"}}>Smart Key Contract Address (Rinkeby Ethereum Network)</label>
                                        <br/><br/>
                                        <span className={"inputbox4"}><span className={"label5"} style={{ }} id={"poolkey"}>
                                        <center>
                                        <pre style={{ width:"90%" }}>
                                        {self.state.key_addr} 
                                        {/* address */}</pre>
                                        </center>
                                        </span></span>
                                        <hr/>
                                        </center>
                                    </div>
                                </div>
                                
                                <div className={"row"}>
                                    <div className={"col-md-12"}>
                                        <center>
                                        <label className={"title2"}>Smart Key Status</label>                            
                                        </center>
                                        <br/>
                                    </div>
                                </div>

                                 <div className={"row"}>
                                    <div className={"col-xs-6"} style={{ textAlign: "right" }}>
                                        <label className={"label6"}>IOTBLOCK Balance</label>
                                    </div>
                                    <div className={"col-xs-6"} style={{ textAlign: "left" }}>
                                        <span className={"label7 eth_balance"}>
                                        {/* balance.toLocaleString() */}
                                        <ContractDAO contract={"SmartKey"} 
                                                        method="getBalance" 
                                                        methodArgs={[self.props.accounts[0]]} 
                                                        isLocaleString={true} />

                                        </span>
                                        <font size={2}> IOTBLOCK</font><br/>
                                    </div>
                                </div>                 
                                        
                                <div className={"row"}>
                                    <div className={"col-xs-6"} style={{ textAlign: "right" }}>
                                        <label className={"label6"}>ETH Balance</label>
                                    </div>
                                    <div className={"col-xs-6"} style={{ textAlign: "left" }}>
                                        <span className={"label7 eth_balance"}>
                                        {/* eth_recv */}
                                        <AccountDAO contract={self.state.key_addr} 
                                                        getBalance={self.state.key_addr}
                                                        units="ether" precision="6" />
                                        </span>
                                        <font size={2}> ETH</font><br/>
                                    </div>
                                </div>                            
                                                            
                                <div className={"row"}>
                                    <div className={"col-xs-6"} style={{ textAlign: "right" }}>
                                
                                        <label className={"label6"}>Received</label>
                                    </div>
                                    <div className={"col-xs-6"} style={{ textAlign: "left" }}>
                                        <span className={"label7 eth_received"}>
                                        {/* eth_recv */}
                                        <ContractDAO contract={self.state.key_addr} 
                                                        method="contrib_amount" 
                                                        methodArgs={[]} 
                                                        units="ether" precision="6" />

                                        </span>
                                        <font size={2}> ETH</font>
                                    </div>
                                </div>

                                
                                <div className={"row"}>
                                    <div className={"col-xs-6"} style={{ textAlign: "right" }}>    
                                        <label className={"label6"}>Device Integrity Status</label>
                                    </div>
                                    <div className={"col-xs-6"} style={{ textAlign: "left" }}>
                                            <label className={"label7"}>
                                                <span className={"health"}>
                                                <ContractDAO contract={self.state.key_addr} 
                                                        method="health" 
                                                        methodArgs={[]} 
                                                        isHealth={true} />

                                                {/* health == 5 ? <b style={{color:'red'}}>
                                                        {healthStates[health]}</b> : <b>{healthStates[health]}</b> */}
                                                </span>
                                            </label>
                                    </div>
                                </div>
                                <div className={"row"}>
                                
                                    <div className={"col-xs-12"} style={{ textAlign: "center" }}>
                                                <button onClick={() => {
                                                    self.showHealthDialog();
                                                }} 
                                                className={"form-control button3 btn btn-primary"} 
                                                type={"button"}>
                                                    <span className={"buttonText"}>Update Integrity Status</span>
                                                </button>
                                        
                                    </div>
                                </div>
                                <div className={"row"}>
                                    <div className={"col-xs-6"} style={{ textAlign: "right" }}>    
                                        <label className={"label6"}>Key State</label>
                                    </div>
                                    <div className={"col-xs-6"} style={{ textAlign: "left" }}>
                                        <label className={"label7 title3"}><span className={"state"}>
                                        {/* states[state] */}
                                        <ContractDAO contract={self.state.key_addr} 
                                                        method="state" 
                                                        methodArgs={[]} 
                                                        isState={true} />
                                        </span></label> 
                                        <font size={2}></font>
                                    </div>
                                </div>
                                { isOwner ? (
                                    <div>
                                <div className={"row"}>
                                    <div className={"col-md-12"}>
                                        <hr/>
                                    </div>
                                </div>    
                                <div className={"row"}>
                                    <div className={"col-md-12"}>
                                        <center>
                                        <label className={"title2"}>Transfer ETH</label>                            
                                        </center>
                                        <br/>
                                    </div>
                                </div>
                                <div id={"eth_transfer"} style={{width:"100%"}}> 
                                    <div className={"row"}>
                                        <div className={"col-xs-6"} style={{ textAlign: "right" }}>
                                            <label className={"label6"}>ETH Amount:</label>
                                        </div>
                                        <div className={"col-xs-6"} style={{ textAlign: "left" }}>                                                
                                            <input id={"send_amt"} className={"form-control m-input m-input--air m-input--pill"} 
                                            onChange={(val) => {
                                                this.setState({transferAmt:$('#send_amt').val()});
                                            }} 
                                            value={this.state.transferAmt} />
                                            <br/>
                                        </div>
                                    </div>
                                    <div className={"row"}>
                                        <div className={"col-xs-6"} style={{ textAlign: "right" }}>
                                            <label className={"label6"}>Beneficiary Address:</label>
                                        </div>
                                        <div className={"col-xs-6"} style={{ textAlign: "left" }}>                                                
                                        
                                            <input id={"beneficiary"} className={"form-control address_val m-input m-input--air m-input--pill"} 
                                            placeholder={"Beneficiary Address"} defaultValue={userAddress} />
                                            <br/>
                                        </div>
                                    </div>
                                    <div className={"row"}>
                                        <div className={"col-xs-12"}>
                                            <button 
                                                onClick={() => {
                                                    self.get_transfer_user_eth_drizzle($('#beneficiary').val(), $('#send_amt').val());
                                                 }} 
                                                 className={"form-control  button3  btn btn-primary"} 
                                                 id={"wd_ether"}><span className={"buttonText"}>Withdraw Ether</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                </div>
                                ) : null }
                                <div id={"eth_transfer_loading"} style={{display:"none"}}>
                                    <center><img src="images/wait.gif" width={100} /></center>
                                </div>

                                { isOwner ? (
                                    <div>
                                <div className={"row"}>
                                    <div className={"col-md-12"}>
                                        <hr/>
                                    </div>
                                </div>    

                                <div className={"row"}>
                                    <div className={"col-md-12"}>
                                        <center>
                                        <label className={"title2"}>API Key</label>                          
                                        </center>  
                                        <br/>
                                    </div>
                                </div>
                                <div className={"row"}>
                                    <div className={"col-xs-6"} style={{ textAlign: "right" }}>    
                                                        <label className={"label6"}>ETH Donation per Transaction:</label>
                                    </div>

                                    <div className={"col-xs-6"} style={{ textAlign: "left" }}>
                                                <div id={"view_api"}>
                                                        <div className={"input-group"}>
                                                            <select id={"eth_contrib"} 
                                                                    style={{width:"90%",
                                                                            height:"45px",
                                                                            borderRadius:"5px",
                                                                            border: "solid 1px #d8d8d8"}} 
                                                                    className={"div-control m-input m-input--air"}
                                                            >
                                                                <option value={"0.0001"}>0.0001 ETH</option>
                                                                <option value={"0.001"}>0.001 ETH</option>
                                                                <option value={"0.01"}>0.01 ETH</option>
                                                                <option value={"0.1"}>0.1 ETH</option>
                                                                <option value={"1"}>1 ETH</option>
                                                                
                                                            </select>
                                                        </div>
                                                </div>
                                    </div>
                                </div>
                                <div className={"row"}>
                                    <div className="col-xs-12">
                                                            <div className={"input-group-"}>
                                                                <button   
                                                                  onClick={() => {
                                                                    self.get_api_key();
                                                                  }}  
                                                                  style={{ width: "50%" }}
                                                                className={"form-control button3 btn btn-primary"} 
                                                                type={"button"} 
                                                                >
                                                                <span className={"buttonText"}>View API Key</span>
                                                                </button>
                                                                <a href="#auth" onClick={() => {
                                                                    self.props.showPage2_api();
                                                                    //self.generate_api_key();
                                                                }}
                                                                style={{ width: "50%" }}
                                                                className={"form-control button3 btn btn-primary"} >
                                                                <span className={"buttonText"}>Regenerate Key</span></a>

                                                            </div>
                                                        </div>
                                                        <br/>
                                                

                                            
                                        </div>
                                </div>
                                 ) : null}
                                <div id={"view_api_loading"} style={{display:"none"}}>
                                    <center><img src="images/wait.gif" width={100} /></center>
                                </div>
                                <div id={"new_api_key"} style={{display:"none"}}>
                                    <div className={"row"}>
                                        <div className={"col-md-12"}>
                                                
                                                <center>
                                                <label className={"title2"}>Authorization API KEY </label>
                                                </center>
                                                <center>
                                                <pre style={{width:"600px", height:"60px",textAlign:'center', background:'white'}}>
                                                <span className={"auth_key"}></span></pre>
                                                </center>
                                                <br/>
                                        </div>
                                        <div className={"col-md-2"}>
                                        </div>
                                    </div>
                                </div>
                                
                                                
                                <div className={"row"}>
                                    <div className={"col-md-12"}>
                                        <hr/>
                                    </div>
                                </div>
                            
                    
                                <div className={"row"}>
                                    <div className={"col-md-12"}>
                                                    <center>
                                                        <label className={"title2"}>
                                                        Transactions
                                                        </label>
                                                    </center> 
                                                    <hr/>
                                                   
                                                    <div id={"transactions"}
                                                    style={{

                                                        width:"100%",
                                                        padding:"20px",
                                                    }}
                                                    >
                                                    {/*
                                                    {this.state.transactions ? 
                                                    self.state.transactions.map(item => {
                                                        var account=item["account"];
                                                        var date=item["date"];
                                                        var amount=item["amount"];
                                                        var tx_type=item["tx_type"];
                                                        return self.fill_page2_transactions(account, date, amount, tx_type);

                                                    }) : null }
                                                    {self.state.transactionCount && self.state.transactionCount > self.state.transactions.length ?
                                                        self.fill_page2_transactions_load_more()
                                                        : null }
                                                    */}
                                                    </div>
                                                    <ContractDAO contract={self.state.key_addr} 
                                                    method="getTransactionCount"
                                                    methodArgs={[self.state.key_addr]}
                                                    value_post_process={(val)=> {
                                                        var items=[];
                                                        for (var i=val -1; i>= 0; i--) {
                                                            var idx=i;
                                                            items.push(<ContractDAO key={idx} contract={self.state.key_addr} 
                                                            method="transactions" 
                                                            methodArgs={[self.state.key_addr, idx]}
                                                            object_values={['date','account','transaction_type','amount']} 
                                                            object_labels={['Date','Address','Type','Amount']} 
                                                            object_classes={['col-md-3','col-md-5','col-md-2','col-md-2']}
                                                            object_values_post_process={[
                                                                (date) => {
                                                                    var dateTime = new Date(parseInt(date) * 1000);
                                                                    date=dateTime.toISOString(); 
                                                                    return date;
                                                                },
                                                                (address) => {
                                                                    return address
                                                                },
                                                                (tx_type) => {
                                                                    var tx='Incoming';
                                                                    if (tx_type > 0) {
                                                                        tx='Outgoing';
                                                                    }
                                                                    return tx;
                                                                },
                                                                (amount) => {

                                                                    var eth1=1000000000000000000;
                                                                    return (amount / eth1) + " ETH"
                                                                }]} 
                                                                object_add_hr={true}
                                                            />);
                                                        }
                                                        return items;
                                                    }
                                                }
                                                    />
                                                <center>
                                                        <label className={"title2"}>
                                                        Key Events
                                                        </label>
                                                    </center> 
                                                    <hr/>
                                                    <ContractDAO contract={self.state.key_addr} 
                                                    method="getTransactionCount"
                                                    methodArgs={[self.state.key_addr]}
                                                    value_post_process={(val)=> {
                                                        var items=[];
                                                        for (var i=val -1; i>= 0; i--) {
                                                            var idx=i;
                                                            items.push(<ContractDAO key={idx} contract={"SmartKey"} 
                                                            method="events" 
                                                            methodArgs={[self.state.key_addr, idx]}
                                                            object_values={['date','account','transaction_type','amount', 'transaction_name','health_status']} 
                                                            object_labels={['Date','Address','Type','Amount','Event','Health']} 
                                                            object_classes={['col-md-2','col-md-4','col-md-1','col-md-1','col-md-2','col-md-2']}
                                                            object_values_post_process={[
                                                                (date) => {
                                                                    var dateTime = new Date(parseInt(date) * 1000);
                                                                    date=dateTime.toISOString(); 
                                                                    return date;
                                                                },
                                                                (address) => {
                                                                    return address
                                                                },
                                                                (tx_type) => {
                                                                    var tx='Incoming';
                                                                    if (tx_type > 0) {
                                                                        tx='Outgoing';
                                                                    }
                                                                    return tx;
                                                                },
                                                                (amount) => {

                                                                    var eth1=1000000000000000000;
                                                                    return (amount / eth1) + " ETH"
                                                                },
                                                                (transaction_name) => {
                                                                    return web3Utils.get_web3().utils.hexToAscii(transaction_name)
                                                                },
                                                                (health_status) => {
                                                                    return web3Utils.get_web3().utils.hexToAscii(health_status)
                                                                }]} 
                                                                object_add_hr={true}
                                                            />);
                                                        }
                                                        return items;
                                                    }
                                                }
                                                    />
                                    </div>
                                </div>
                            </div>
                        </div>            
                    </div>
    )
  }
}

KeyInfo.contextTypes = {
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
  
  
  
  
export default connect( stateToProps, dispatchToProps)( drizzleConnect(KeyInfo,drizzleStateToProps, drizzleDispatchToProps))
