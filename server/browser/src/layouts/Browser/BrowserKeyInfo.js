import React, { Component } from 'react'
import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import * as web3Utils from "../../util/web3/web3Utils";
var $ = require ('jquery');



const stateToProps = state => {
    return {
      
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
    };
};

@connect(stateToProps, dispatchToProps)
export default class BrowserKeyInfo extends Component {
  constructor(props) {
    super(props)
    this.state={
        transferAmt:1,
    }

  }
  
  fill_page2 = (href, address, balance, eth_recv, vault, state, health, isOwner)  => {
    var self=this;
    console.log(address, balance, eth_recv, vault, state, health);
    $('#loading').show();
    $('#page2').hide();
 
     //alert(eth_sent);
     if (address == '0x0000000000000000000000000000000000000000') {
         //$('#page1').show();
         $('#loading').hide();
         $('#page2').hide();
     } else {
        var eth1_amount=1000000000000000000       
        balance/=eth1_amount;
        eth_recv/=eth1_amount;
        var states=[ 'Issued', 'Active', 'Returned' ]
        var healthStates = ['Provisioning', 'Certified', 'Modified', 'Compromised', 'Malfunctioning', 'Harmful', 'Counterfeit' ]
        
        //$('#page1').hide();
        $('#loading').hide();
        $('#page2').show();
        
        if (isOwner) {
            $('#eth_transfer').show();
            
        } else {
            $('#eth_transfer').hide();
        
        }
        
        $('.eth_balance').html(balance);
        $('.eth_received').html(eth_recv);
        $('.vault').html( vault );
        $('.state').html( states[state] );
        $('.health').html( healthStates[health] );
        $('.progress-bar').val( balance / eth_recv * 100 );
        $('#poolkey').html('<pre>' + address + '</pre>');
        
        $('#contrib-stat').html('');
        var Morris=window.Morris;
        Morris.Donut({
           element: 'contrib-stat',
           data: [
             {label: "Received ETH", value:  eth_recv},
             {label: "Available ETH", value:  balance},
           ]
         });
         
          
         $('#send_ether').on('click', function(e) {
                var eth1=1000000000000000000;
                var amt=parseInt($('#send_amt').val()) * eth1;
                self.send_ether(address, amt);
        });       
    }
    self.get_smartkey_transactions(href, 0, 10);
 
    
    }  
    
    get_smartkey_transactions = (href, offset, limit) => {
        var self=this;
        $('.loadmore').hide();
        $.ajax({
                beforeSend: function(xhr){
                    self.add_auth(xhr);
                    //setHeaders(xhr);
                
                },
                type: 'GET',
                url: '/cat/getNodeSmartKeyTx?href=' + encodeURIComponent(href) + '&offset=' + encodeURIComponent(offset) + '&limit=' + encodeURIComponent(limit),
                //data: JSON.stringify(user_item),
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function(body, textStatus, xhr) {
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
                    
                },
                error: function(xhr, textStatus, err) {
                    console.log(xhr.status + ' ' + xhr.statusText);
                }
            });
    }
    
    fill_page2_transactions = (sender, date, amount, tx_type) => {
            console.log(sender, date, amount);
            var dateTime = new Date(parseInt(date) * 1000);
            date=dateTime.toISOString(); 
            var eth1=1000000000000000000;
            var tx='Incoming';
            if (tx_type > 0) {
                tx='Outgoing';
            }
            var html ="<div class='row label8'><div class=col-md-3>";
            html +='<b>Date:</b><br/> ' + date + "</div><div class=col-md-5>";
            html +='<b>Address:</b><br/> ' + sender + "</div><div class=col-md-2>";
            html +='<b>Type:</b><br/> ' + tx + "</div><div class=col-md-2>";
            html +='<b>Amount:</b><br/> ' + amount/eth1 + " ETH </div>";
            html +="<hr/></div><br/>";
            
            $('#transactions').append(html);
    }
        
    fill_page2_transactions_load_more = (href, offset, limit, count) => {
            offset=parseInt(offset)
            offset+=limit;
            if (offset < count) {
                var html ="<div class='row label8 loadmore'><div class=col-md-12><center>";
                html +='<a href="#transactions" className={"button3 form-control btn btn-primary"} onClick="JavaScript:get_smartkey_transactions(\'' + href + '\', ' + offset + ', ' + limit + ');"><span className={"buttonText"}>Load More</span></a>'
                html +="</center><br/><br/></div>";
                
                $('#transactions').append(html);
            }
    
    }    
    
    
get_smart_key_info = (href) => {

    var self=this;
    $.ajax({
            beforeSend: function(xhr){
                self.add_auth(xhr);
                //setHeaders(xhr);
            
            },
            type: 'GET',
            url: '/cat/getNodeSmartKey?href=' + encodeURIComponent(href),
            //data: JSON.stringify(user_item),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(body, textStatus, xhr) {
                self.fill_page2(href, body["address"], body["balance"], body["eth_recv"], body["vault"], body["state"], body["health"], body["isOwner"]);
            },
            error: function(xhr, textStatus, err) {
                console.log(xhr.status + ' ' + xhr.statusText);
            }
        });
}


get_transfer_node_eth = (href, beneficiary, amount) => {
   var self=this;
   var eth1=1000000000000000000;
   var amt=parseFloat(amount) * eth1;
   $('#eth_transfer').hide();
   $('#eth_transfer_loading').show();
   $.ajax({
            beforeSend: function(xhr){
                self.add_auth(xhr);
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
               self.fill_page2(href, body["address"], body["balance"], body["eth_recv"], body["vault"], body["state"], body["health"], body["isOwner"]);
            },
            error: function(xhr, textStatus, err) {
               $('#eth_transfer').show();
               $('#eth_transfer_loading').hide();
               console.log(xhr.status + ' ' + xhr.statusText);
            }
        });
}



setHealth = (href, health) => {
   var self=this;
   var health=parseInt(health)
   $('#health').hide();
   $('#health_loading').show();
   $.ajax({
            beforeSend: function(xhr){
                self.add_auth(xhr);
                    //setHeaders(xhr);
            },
            type: 'GET',
            url: '/cat/setHealth?href=' + encodeURIComponent(href) + '&health=' + encodeURIComponent(health),
            //data: JSON.stringify(user_item),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(body, textStatus, xhr) {
               $('#health').show();
               $('#health_loading').hide();
               self.fill_page2(href, body["address"], body["balance"], body["eth_recv"], body["vault"], body["state"], body["health"], body["isOwner"]);
            },
            error: function(xhr, textStatus, err) {
               $('#health').show();
               $('#health_loading').hide();
               console.log(xhr.status + ' ' + xhr.statusText);
            }
        });
}

  render() {
    return(
    <div id={"browserkeyinfo"} >
        <div className={"row"}>
            <div className={"col-md-12"}>    
                <center><label className={"title2"}>Catalogue Smart Key Contract Address</label></center><br/>
            </div>
        </div>
        <div className={"row"}>
            <div className={"col-md-12"}>    
        
                <center><h3><span id={"poolkey"}></span></h3></center>
        
            </div>
        </div>
        
        <div className={"row"}>
            <div className={"col-md-12"}>    
                <hr/>
            </div>
        </div>
        <div className={"row"}>
            <div className={"col-md-6"}>    
                <div className={"m-portlet m-portlet--tab"}>
                       <div className={"m-portlet__head"}>
                
                            <br/><br/>                    
                            
                            <div className={"row"}>
                                <div className={"col-md-6"}>    
                                    
                                    <h3>ETH BALANCE</h3>
                                    <div className={"row"}>
                                        <div className={"col-md-12"}>
                                            <h3><span className={"eth_balance"}></span></h3>
                                            <font size={2}>ETH</font><br/>
                                        </div>
                                    </div>                            
                                    
                                    
                                </div>
                                <div className={"col-md-6"}>    
                                    
                                    <h3>ETH RECEIVED</h3>
                                    <h3><span className={"eth_received"}></span></h3> <font size={2}>ETH</font>
        
                                    
                                </div>
                            </div>
                           
                            <div className={"row"}>
                                <div className={"col-md-12"}>
                                        <br/><br/>
                                        <h4>
                                             
                                             <div className={"progress m-progress--sm"}>
                                                <div className={"progress-bar m--bg-accent"} 
                                                role={"progressbar"} 
                                                style={{height:"35px"}} 
                                                ariaValuenow={"0"} 
                                                ariaValuemin={"0"} 
                                                ariaValuemax={"100"}>
                                                <b><span className={"eth_sent"}></span></b>
                                                </div>
                                            </div>
                                            
                                        </h4>
                                        <br/><br/>
                                </div>
                            </div>
                            
                             <div className={"row"}>
                                <div className={"col-md-6"}>    
                                    <h3 class='status'>Health Status</h3>
                                    <label className={"title3"}><span class='health'></span></label>
                                </div>
                                <div className={"col-md-6"}>    
                                    <h3>Key State</h3>
                                    <label className={"title3"}>    
                                    <span className={"state"}></span>   
                                    </label> <font size={2}></font><br/>
                                    
                                </div>
                            </div>
                        </div>
                      </div>
                     </div>
                     <div className={"col-md-6"}>    
                            <div className={"m-portlet m-portlet--tab"}>
                                   <div className={"m-portlet__head"}>     
                                                        <label className={"title3"}>Vault</label>
                                                        <br/>
                                                        <label className={"label2"}>
                                                        <pre><span className={"vault"}></span></pre> 
                                                        <font size={2}></font>
                                                        </label>
                                                        <br/>
                                                        <div id={"contrib-stat"} style={{height: "200px"}}></div>
                                                        <br/>
                                                        <div className={"row"} id={"eth_transfer"}>
                                                            <div className={"col-md-4"}>
                                                                ETH Amount:<br/>
                                                                <input id={"send_amt"} className={"form-control m-input m-input--air m-input--pill"} 
                                                                onChange={() => {
                                                                    this.setState({transferAmt:$('#send_amt').val()});
                                                                }}
                                                                value={this.state.transferAmt} />
                                                            </div>
                                                            <div className={"col-md-5"}>
                                                                Beneficiary Address:<br/>
                                                                <input id={"beneficiary"} className={"address_val form-control m-input m-input--air m-input--pill"} 
                                                                placeholder={"Beneficiary Address"} />
                                                            </div>
                                                            <div className={"col-md-3"}>
                                                                <br/>
                                                                <a href='#eth_transfer' onClick="JavaScript:get_transfer_node_eth($('#browse_url').val(), $('#beneficiary').val(), $('#send_amt').val())" className={"btn btn-primary"} id={"wd_ether"}>Transfer Ether</a>
                                                            </div>
                                                         </div>
                                                         <div className={"row"} id={"eth_transfer_loading"} style={{display:"none"}}>
                                                            <div className={"col-md-12"} >
                                                                    <center><img src="images/wait.gif" width={100} /></center>
                                                            </div>                                                    
                                                         </div>
                                </div>
                            </div>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col-md-12"}>
                        <div id={"health"}>
                        <center>
                        <label className={"title3"}>Update Device Integrity Status</label>
                        <br/>
                        <div className={"m-btn-group m-btn-group--pill btn-group m-btn-group m-btn-group--pill btn-group-lg"}>
                            <button onClick="JavaScript:setHealth($('#browse_url').val(),0)" type="button" className={"btn btn-primary"}>Provisioning</button>
                            <button onClick="JavaScript:setHealth($('#browse_url').val(),1)" type="button" className={"btn btn-success"}>Certified</button>
                            <button onClick="JavaScript:setHealth($('#browse_url').val(),2)" type="button" className={"btn btn-info"}>Modified</button>
                            <button onClick="JavaScript:setHealth($('#browse_url').val(),3)" type="button" className={"btn btn-danger"}>Compromised</button>
                            <button onClick="JavaScript:setHealth($('#browse_url').val(),4)" type="button" className={"btn btn-danger"}>Malfunctioning</button>
                            <button onClick="JavaScript:setHealth($('#browse_url').val(),5)" type="button" className={"btn btn-danger"}>Harmful</button>
                            <button onClick="JavaScript:setHealth($('#browse_url').val(),6)" type="button" className={"btn btn-danger"}>Counterfeit</button>
                        </div>
                        </center>
                        </div>
                        <div id={"health_loading"} style={{display:"none"}}>
                        <center><img src="images/wait.gif" width={100} /></center>
                        </div>
                        <br/><br/><br/>    
                    </div>
                </div> 
                <div className={"row"}>
                    <div className={"col-md-12"}>
                        <div className={"m-portlet m-portlet--tab"}>
                                   <div className={"m-portlet__head"}>
                                       <br/>
                                       <center><label className={"title3"}>Transactions</label></center> 
                                        <hr/>
                                       <div id={"transactions"}>
                                       </div>
                                   </div>
                        </div>
                    </div>
                </div>
        
        </div>
    )
  }
}