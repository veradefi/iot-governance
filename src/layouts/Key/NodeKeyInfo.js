import React, { Component } from 'react'
import KeyHealth from "./KeyHealth";
import * as web3Utils from "../../util/web3/web3Utils";

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
export default class NodeKeyInfo extends Component {
    static propTypes = {
        showDialog:PropTypes.func.isRequired,
        closeDialog:PropTypes.func.isRequired,
        api_auth: PropTypes.string.isRequired,
        api_key: PropTypes.string.isRequired,
        eth_contrib: PropTypes.number.isRequired,
        isAuthenticated: PropTypes.bool.isRequired,
    };
  
  /**
   * Creates an instance of OrderDialog.
   * @constructor
   * @param {any} props
   * @memberof OrderDialog
   */

  constructor(props) {
    super(props);

    this.state = {
        loading:true,
        transferAmt:0.1,
        keyInfo:props.keyInfo,
        
    };
    this._isMounted = false;
  }

    
showHealthDialog = () => {
    this.setState({health_init:true});
    $('.donate_amt').html($('#eth_contrib').val());
    this.props.showDialog(true, <KeyHealth account={this.props.myAddress} setHealth={this.setHealth} />);
    
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
        //if (parseInt(offset) == 0) {
        //    $('#transactions').html('');
        //}
        $.ajax({
                beforeSend: function(xhr){
                    self.props.add_auth(xhr);
                    //setHeaders(xhr);
                
                },
                type: 'GET',
                url: '/cat/getNodeSmartKeyTx?href=' + encodeURIComponent(href) + '&offset=' + encodeURIComponent(offset) + '&limit=' + encodeURIComponent(limit),
                //data: JSON.stringify(user_item),
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function(body, textStatus, xhr) {
                    var transactions=body["transactions"];
                    if (self.state.transactions && offset > 0) {
                        transactions=[...self.state.transactions, ...transactions];
                    }
                    var count=parseInt(body["count"]);
                    var txParams={href, offset, limit}
                    self.setState({transactions:transactions, transactionCount:count, transactionParams:txParams});

                    /*
                    if (parseInt(offset) == 0) {
                        $('#transactions').html('');
                    }
                    var transactions=body["transactions"];
                    for (var i=0; i < transactions.length; i++) {
                        var account=transactions[i]["account"];
                        var date=transactions[i]["date"];
                        var amount=transactions[i]["amount"];
                        var tx_type=transactions[i]["tx_type"];
                        self.fill_page2_transactions(account, date, amount, tx_type)
                    }
                    var count=parseInt(body["count"]);
                    self.fill_page2_transactions_load_more(href, offset, limit, count);
                    */
                    
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
        var html =(
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
                   
                    <hr/>
            </div>
        )
        
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
            <div className={'row label8 loadmore'}>
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


get_transfer_node_eth = (beneficiary, amount) => {
    var self=this;
    var href=this.state.keyInfo.url;
    var eth1=1000000000000000000;
    var amt=parseFloat(amount) * eth1;
    $('#eth_transfer').hide();
    $('#eth_transfer_loading').show();
    $.ajax({
             beforeSend: function(xhr){
                 self.props.add_auth(xhr);
                 //setHeaders(xhr);
             
             },
             type: 'GET',
             url: '/cat/transferNodeEth?href=' + encodeURIComponent(href) + '&beneficiary=' + encodeURIComponent(beneficiary) + '&amount=' + encodeURIComponent(amt),
             //data: JSON.stringify(user_item),
             contentType: "application/json; charset=utf-8",
             dataType: 'json',
             success: function(body, textStatus, xhr) {
                $('#eth_transfer').show();
                $('#eth_transfer_loading').hide();
                self.props.get_smart_key_info();
             },
             error: function(xhr, textStatus, err) {
                $('#eth_transfer').show();
                $('#eth_transfer_loading').hide();
                console.log(xhr.status + ' ' + xhr.statusText);
             }
         });
 }
 

setHealth = (health) => {
    var self=this;
    var href=this.state.keyInfo.url;
    var health=parseInt(health)
    $('#health').hide();
    $('#health_loading').show();
    $.ajax({
             beforeSend: function(xhr){
                 self.props.add_auth(xhr);
                     //setHeaders(xhr);
             },
             type: 'GET',
             url: '/cat/setHealth?href=' + encodeURIComponent(href) + '&health=' + encodeURIComponent(health),
             //data: JSON.stringify(user_item),
             contentType: "application/json; charset=utf-8",
             dataType: 'json',
             success: function(body, textStatus, xhr) {
                //$('#health').show();
                $('#health_loading').hide();
                self.props.get_smart_key_info()
                self.hideHealthDialog();
             },
             error: function(xhr, textStatus, err) {
                $('#health').show();
                $('#health_loading').hide();
                console.log(xhr.status + ' ' + xhr.statusText);
             }
         });
 }


componentDidMount() {
    var self=this;
    var {address, balance, eth_recv, vault, state, health, tokens, isOwner, states, healthStates, url}=this.props.keyInfo;

    self.get_smartkey_transactions(url,0,10);
    
    
    
}

componentWillReceiveProps(newProps) {
    var self=this;
    if (newProps.keyInfo && !(JSON.stringify(newProps.keyInfo) === JSON.stringify(this.props.keyInfo))) {
        self.get_smartkey_transactions(newProps.keyInfo.url,0,10);
        this.setState({keyInfo:newProps.keyInfo})
    }

}

render() {
    var self=this;
    var {address, balance, eth_recv, vault, state, health, tokens, isOwner, states, healthStates}=this.state.keyInfo;
    
   

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
                                        <span className={"inputbox4"}>
                                        <span className={"label5"} style={{ }} id={"poolkey"}>
                                        <center>
                                        <pre style={{ maxWidth:"50%" }}>{address}</pre>
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
                                    <div className={"col-md-6"} style={{ textAlign: "right" }}>
                                        <label className={"label6"}>Balance</label>
                                    </div>
                                    <div className={"col-md-6"} style={{ textAlign: "left" }}>
                                        <span className={"label7 eth_balance"}>
                                        {balance}
                                        </span>
                                        <font size={2}> ETH</font><br/>
                                    </div>
                                </div>                            
                                                            
                                <div className={"row"}>
                                    <div className={"col-md-6"} style={{ textAlign: "right" }}>
                                
                                        <label className={"label6"}>Received</label>
                                    </div>
                                    <div className={"col-md-6"} style={{ textAlign: "left" }}>
                                        <span className={"label7 eth_received"}>
                                        {eth_recv}</span>
                                        <font size={2}> ETH</font>
                                    </div>
                                </div>

                                
                                <div className={"row"}>
                                    <div className={"col-md-6"} style={{ textAlign: "right" }}>    
                                        <label className={"label6"}>Device Integrity Status</label>
                                    </div>
                                    <div className={"col-md-2"} style={{ textAlign: "left" }}>
                                            <label className={"label7"}>
                                                <span className={"health"}>
                                                
                                                {health == 5 ? <b style={{color:'red'}}>{healthStates[health]}</b> : <b>{healthStates[health]}</b>}
                                                </span>
                                            </label>
                                    </div>
                                    <div className={"col-md-4"} style={{ textAlign: "left" }}>
                                                <button onClick={() => {
                                                    self.showHealthDialog();
                                                }} 
                                                className={"div-control button3 btn btn-primary"} 
                                                type={"button"}>
                                                    <span className={"buttonText"}>Update Integrity Status</span>
                                                </button>
                                        
                                    </div>
                                </div>
                                <div className={"row"}>
                                    <div className={"col-md-6"} style={{ textAlign: "right" }}>    
                                        <label className={"label6"}>Key State</label>
                                    </div>
                                    <div className={"col-md-6"} style={{ textAlign: "left" }}>
                                        <label className={"label7 title3"}><span className={"state"}>
                                        { states[state] }
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
                                <div id={"eth_transfer"} style={{width:"95%"}}> 
                                    <div className={"row"}>
                                        <div className={"col-md-6"} style={{ textAlign: "right" }}>
                                            <label className={"label6"}>ETH Amount:</label>
                                        </div>
                                        <div className={"col-md-6"} style={{ textAlign: "left" }}>                                                
                                            <input id={"send_amt"} className={"form-control m-input m-input--air m-input--pill"} 
                                            onChange={(val) => {
                                                this.setState({transferAmt:$('#send_amt').val()});
                                            }} 
                                            value={this.state.transferAmt} />
                                            <br/>
                                        </div>
                                    </div>
                                    <div className={"row"}>
                                        <div className={"col-md-6"} style={{ textAlign: "right" }}>
                                            <label className={"label6"}>Beneficiary Address:</label>
                                        </div>
                                        <div className={"col-md-6"} style={{ textAlign: "left" }}>                                                
                                        
                                            <input id={"beneficiary"} className={"form-control address_val m-input m-input--air m-input--pill"} 
                                            placeholder={"Beneficiary Address"} defaultValue={self.props.api_auth} />
                                            <br/>
                                        </div>
                                    </div>
                                    <div className={"row"}>
                                        <div className={"col-md-6"} style={{ textAlign: "right" }}>
                                        </div>
                                        <div className={"col-md-6"}>
                                            <a href='#eth_transfer' 
                                                onClick={() => {
                                                    self.get_transfer_node_eth($('#beneficiary').val(), $('#send_amt').val());
                                                 }} 
                                                 className={"button3 form-control  btn btn-primary"} 
                                                 id={"wd_ether"}><span className={"buttonText"}>Withdraw Ether</span></a>
                                        </div>
                                    </div>
                                </div>
                                </div>
                                ) : null }
                                <div id={"eth_transfer_loading"} style={{display:"none"}}>
                                    <center><img src="images/wait.gif" width={100} /></center>
                                </div>

                                { isOwner ? (
                                <div className={"row"}>
                                    <div className={"col-md-12"}>
                                        <hr/>
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
                                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>            
                    </div>
    )
  }
}

