import React, { Component } from 'react'
import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import * as web3Utils from "../../util/web3/web3Utils";
import {Springy, Graph, Node} from "springy";
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
export default class Explorer extends Component {
  constructor(props) {
    super(props)
    var self=this;

    this.state={
        transferAmt:1,
        isSmartKey:false,
        isBrowse:false,
        isWeb:false,
        isPool:true,
        max_contrib:10000,
        max_per_contrib:100000,
        min_per_contrib:1,
        fee:5,
        auto:"0",
        send_amt:1        
    }
    self.graph={}; 
    self.cursor=""
    self.cursor_subURL = "";
    self.facts=[];
    
  }

  
  fill_page2 = (address, eth_balance, eth_sent, contrib_total, max_contrib, max_per_contrib, min_per_contrib, fee, received, autoDistribute, members) => {
       var self=this;
       if (address != '0x0') {
           self.setState({page:'page2'})
           //$('#page1').hide();
           //$('#loading').hide();
           //$('#page2').show();
           if (!autoDistribute) {
               $('.distribute').show();
           }
            console.log(eth_sent, contrib_total, max_contrib, max_per_contrib, min_per_contrib, fee);
           $('.eth_balance').html('' + eth_balance);
           $('#distribute_ether').html('Distribute Balance to ' + members.length + ' Members');
           $('.eth_sent').html(eth_sent);
           $('.max_contrib').html( max_contrib);
           $('.max_per_contrib').html(max_per_contrib);
           $('.min_per_contrib').html(min_per_contrib);
           $('.fee').html(fee);
           $('.received').html(received);
           $('.progress-bar').val(eth_sent/max_per_contrib * 100);
           $('#poolkey').html('<pre>' + address + '</pre>');
           if ( contrib_total) {
           window.Morris.Donut({
              element: 'contrib-stat',
              data: [
                {label: "Member Donated ETH", value: contrib_total},
                {label: "ETH Received", value:  received},
              ]
            });
            $('#contrib-stat').show();

        } else {
            $('#contrib-stat').hide();
        }
            
            
           $('#send_ether').on('click', function(e) {
                   var eth1=1000000000000000000;
                   var amt=parseInt($('#send_amt').val()) * eth1;
                   web3Utils.send_ether(address, amt);
           });       
           
           function done_sending(res) {
             //$('#page1').hide();
             //$('#loading').hide();
             //$('#page2').show();
             self.setState({page:'page2'})
           
           }
           
           $('#distribute_ether').on('click', function(e) {
                   var eth1=1000000000000000000;
                     //$('#page1').hide();
                     //$('#loading').show();
                     //$('#page2').hide();
                     self.setState({page:'loading'})
           
                
                     web3Utils.distribute_pool_ether(address, done_sending);
           });       
           
           
           $('#transactions').html('');
           web3Utils.get_pool_transactions(address, self.fill_page2_transactions);
         } else {
             //$('#page1').show();
             //$('#loading').hide();
             //$('#page2').hide();
             self.setState({page:'page1'})
           
           
         }
    }  

    fill_page2_transactions = (sender, date, amount, tx_type) => {
        var self=this;
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
        html +="</div><hr/><br/>";
        
        $('#transactions').append(html);
    }

    
    page2 = (address) => {
       var self=this;
       self.setState({page:'loading'})

       //$('#page1').hide();
       //$('#loading').show();
       //$('#page2').hide();
      console.log("Page2 " + address);
       web3Utils.get_pool(address, self.fill_page2);
    }
    
    
    componentDidMount() {
        var self=this;
        $('#fee').on('change', function(e) {
            $('#fee_struct').show();
            
            var fee=parseFloat($('#fee').val());
            var you=fee - 0.5;
            var you_msg = you + '%';
            $('#you').html(you_msg);
            var total_msg = fee  + '%';
            $('#total').html(total_msg);
            
            
            
        });
        
       
    
        $('#pool').on('click', function (e) {
            var fee=Math.round(1 / parseFloat($('#fee').val() / 100));
            var whitelist=[];
            var admins=[];
            var has_whitelist=false;
            /*
            if ($('#whitelist1').val().length > 0) {
                whitelist.push($('#whitelist1').val());
            }
            if ($('#whitelist2').val().length > 0) {
                whitelist.push($('#whitelist2').val());
            }
            if ($('#whitelist3').val().length > 0) {
                whitelist.push($('#whitelist3').val());
            }
            */
            if ($('#has_whitelist')[0].checked) {
                has_whitelist=true;
            }
            
            if ($('#admin1').val().length > 0) {
                admins.push($('#admin1').val());
            }
            if ($('#admin2').val().length > 0) {
                admins.push($('#admin2').val());
            }
            if ($('#admin3').val().length > 0) {
                admins.push($('#admin3').val());
            }
            
            var eth1=1000000000000000000;
            var max_contrib=parseInt($('#max_contrib').val()) * eth1;
            var max_per_contrib=parseInt($('#max_per_contrib').val()) * eth1;
            var min_per_contrib=parseInt($('#min_per_contrib').val()) * eth1;
            
            var beneficiary=$('#address').val();
            var autoDistribute=true;
            if ($('#auto').find('option:selected').val() == '1') {
                autoDistribute=false;
            }
            self.setState({page:'loading'})

            // $('#page1').hide();
            // $('#loading').show();
            // $('#page2').hide();
             
            web3Utils.add_pool(beneficiary, 
                max_contrib, max_per_contrib, min_per_contrib, admins, has_whitelist, fee, autoDistribute, self.page2);
       
        });
        $('#fee').trigger('change');
    
        var eth_salt = web3Utils.getCookie('iotcookie');
        if (eth_salt == null) {
            web3Utils.setCookie('iotcookie',new Date().toUTCString(),7);
            eth_salt = web3Utils.getCookie('iotcookie');
        }
        
        
        var callback=function(address) {
            console.log('address' + address);
            $('.address').html(address);
            $('.address_val').val(address);
            
        }
        
        web3Utils.init_wallet(eth_salt, callback);
      }
    

    render() {
        var self=this;
    var page1=<div style={{padding:"10px"}} id={"page1"}>

                          <br/>
                          <center><label className={"title2"}>Find Smart Pool Key</label></center>
                          <br/>
                          <div className={"row"}>
                                 <div className={"col-md-12"}>
                                         <center>
                                             <div className={"input-group"}>

                                                 <input 
                                                 name={"find_poolkey"}
                                                 className={"inputbox2 form-control m-input m-input--air"}  
                                                 placeholder={"Enter Smart Pool Key Address"}
                                                 style={{
                                                     height:"45px",
                                                     width:"50%"
                                                 }} 
                                                 type="text" 
                                                 id={"find_poolkey"} 
                                                 placeholder="" 
                                                 aria-invalid={"false"} 
                                                 aria-required={"false"} />

                                                <div className={"input-group-append"}>
                                                    <button type={"button"} 
                                                            id={"find_poolkey_btn"} 
                                                            onClick={() => {

                                                                    var poolkey=$('#find_poolkey').val();
                                                                    self.page2(poolkey);
                                                            }}
                                                            className={"btn btn-accent button3"}>
                                                        <span className={"buttonText"}>
                                                        Find
                                                        </span>
                                                    </button>
                                                </div>
                                             </div>
                                          </center>
                                          <br/>
                                  </div>
                            </div>
                            <hr/>
                    <div className={"row"}>
                        <div className={"col-md-12"}>
                          <center>
                              <label className={"title2"}>Create Smart Pool Key</label></center>
                          <br/>
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-md-6"} align={"right"}>
                
                                <label className={"label2"}>Your wallet address:</label>
                        
                         </div>
                         <div className={"col-md-6"} align={"left"}>
                
                                 <input name={"address"} 
                                 className={"address_val inputbox3 form-control m-input m-input--air"}  
                                 type="text"
                                id={"address"} placeholder="" aria-invalid={"false"} aria-required={"false"} />
                         </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-md-12"} align={"right"}>
                             <br/><br/>
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-md-6"} align={"right"}>
                
                                <label className={"label2"}>Maximum Allocation (ETH)</label>
                        
                         </div>
                         <div className={"col-md-6"} align={"left"}>
                
                                <input name={"max_contrib"} 
                                className={"form-control m-input m-input--air m-input--pill"}  
                                matinput="" 
                                type="text" 
                                id={"max_contrib"} 
                                value={self.state.max_contrib}
                                onChange={(e) => {
                                    console.log(e.target.value);
                                    self.setState({max_contrib:parseInt(e.target.value)})
                                }} 
                                placeholder={""} 
                                aria-invalid={"false"} 
                                aria-required="false" />
                         </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-md-6"} align={"right"}>
                            <label className={"label2"}>Maximum Per Donor (ETH)</label>
                        </div>
                         <div className={"col-md-6"} align={"left"}>
                            <input name={"max_per_contrib"} 
                            className={"form-control m-input m-input--air m-input--pill"}  
                            matinput="" 
                            type="text" 
                            id={"max_per_contrib"}  
                            value={self.state.max_per_contrib} 
                            onChange={(e) => {
                                console.log(e.target.value);
                                self.setState({max_per_contrib:parseInt(e.target.value)})
                            }}
                            placeholder="" 
                            aria-invalid={"false"} 
                            aria-required="false" />
                         </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-md-6"} align={"right"}>
                            <label className={"label2"}>Minimum Per Donor (ETH)</label>
                        </div>
                         <div className={"col-md-6"} align={"left"}>
                            <input name={"min_per_contrib"} 
                            className={"form-control m-input m-input--air m-input--pill"} 
                            matinput="" 
                            type="text" 
                            id={"min_per_contrib"} 
                            onChange={(e) => {
                                console.log(e.target.value);
                                self.setState({min_per_contrib:parseInt(e.target.value)})
                            }}
                            value={self.state.min_per_contrib} 
                            placeholder={""} 
                            aria-invalid={"false"} 
                            aria-required="false" />
                        </div>
                    </div>
            
            
                    <div className={"row"}>
                        <div className={"col-md-12"}>
            
                          <h3>
                            <br/>
                          </h3>
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-md-6"} align={"right"}>
                
                          <label className={"label2"}>Admin 1 Wallet Address</label>
                          
                        </div>
                        <div className={"col-md-6"} align={"left"}>
                          
                          <input name={"admin1"} 
                          className={"address_val form-control m-input m-input--air m-input--pill"}  
                          type="text" 
                          id={"admin1"} 
                          onChange={(e) => {
                            console.log(e.target.value);
                            self.setState({admin1:e.target.value})
                          }}
                          value={self.state.admin1}

                          placeholder="" 
                          aria-invalid={"false"} 
                          aria-required="false" />
                      
                         </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-md-6"} align={"right"}>
                
                          <label className={"label2"}>Admin 2 Wallet Address</label>
                        </div>
                        <div className={"col-md-6"} align={"left"}>
                            <input name={"admin2"} 
                            className={"form-control m-input m-input--air m-input--pill"}  
                            matinput="" 
                            type="text" 
                            id={"admin2"} 
                            onChange={(e) => {
                                console.log(e.target.value);
                                self.setState({admin2:e.target.value})
                              }}
                            value={self.state.admin2}
                            placeholder="" 
                            aria-invalid={"false"} 
                            aria-required="false" />
                        </div>
                    </div>
                      
                    <div className={"row"}>
                        <div className={"col-md-6"} align={"right"}>
                
                          <label className={"label2"}>Admin 3 Wallet Address</label>
                        </div>
                        <div className={"col-md-6"} align={"left"}>
                            <input name={"admin3"} 
                            className={"form-control m-input m-input--air m-input--pill"}  
                            matinput="" 
                            type="text" 
                            id={"admin3"} 
                            onChange={(e) => {
                                console.log(e.target.value)
                                self.setState({admin3:e.target.value})
                            }}
                            value={self.state.admin3}
                            placeholder="" 
                            aria-invalid={"false"} 
                            aria-required="false" />
                        </div>
                    </div>
                    
                                        
                    <div className={"row"}>
                        <div className={"col-md-12"}>
                
                          <label><h3><br/></h3></label>
                          
                                              
                        </div>
                        
                    </div>
                    <div className={"row"}>
                        <div className={"col-md-6"} align={"right"} >
                          <label className={"label2"}>Enable Whitelist</label>
                        </div>
                        <div className={"col-md-6"} align={"left"} valign={"middle"}>
                            <span className={"m-switch m-switch--info"}>
												<label>
                                                <input 
                                                type={"checkbox"} 
                                                id={"has_whitelist"}
                                                value={"Yes"} 
                                                />
						                        <span></span>
						                        </label>
						                    </span>
                        </div>
                    </div>
                    
                    
                    <div className={"row"}>
                        <div className={"col-md-12"}>
                          <h3><br/></h3>
                        </div>
                    </div>
                    
                    <div className={"row"}>
                        <div className={"col-md-6"} align={"right"}>    
                          <label className={"label2"}>Pool Fee Percentage</label>
                        </div>
                        <div className={"col-md-6"} align={"left"}>
                        
                            <input name={"fee"} 
                            className={"form-control m-input m-input--air m-input--pill"}  
                            matinput="" 
                            max="50" 
                            min="0" 
                            size="6" 
                            type="number" 
                            id={"fee"} 
                            onChange={(e) => {
                                console.log(e.target.value);
                                self.setState({fee:parseInt(e.target.value)})
                            }}
                            value={self.state.fee}
    
                            placeholder="" 
                            aria-invalid={"false"} 
                            aria-required={"false"}
                            />
                        </div>
                    </div>
                    <br/>
                    <div className={"row"}>
                        <div className={"col-md-6"} align={"right"}>
                           <label className={"label2"}>Fee Percentage</label>
                        </div>
                        <div className={"col-md-6"} align={"left"}>
                                  <label className={"text2"}>Our Fee is fixed at 0.5%.</label>
                  
                          <div id={"fee_struct"} 
                          style={{display:"none"}} 
                          align={"left"}>
                                   
                                  <ul style={{maxWidth:"50%"}}>
                                    <li><span id={"you"}></span> goes to you.</li>
                                    <li>0.5% goes to Our Fee.</li>
                                    <li><b>Total: <span id={"total"}>0.50%</span></b></li>
                                  </ul>
                           </div>         
                        </div>          
                    </div>
                    
                    <div className={"row"}>
                        <div className={"col-md-12"}>    
                            <br/>
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-md-6"} align={"right"}>  
                            <label className={"label2"}> 
                            Distributes Tokens 
                            </label>
                        </div>
                        <div className={"col-md-6"} align={"left"}>    
                            <select 
                            name={"auto"} 
                            id={"auto"}
                            onChange={(e) => {
                                console.log(e.target.value);
                                self.setState({auto:e.target.value})
                            }}
                            value={self.state.auto}
    
                            >
                                <option value={"0"}>Automatically</option>
                                <option value={"1"}>Manually</option>
                            </select>
                        </div>
                    </div>
                    <center>
                    <br/>
                    <button 
                        type={"button"} 
                        id={"pool"} 
                        className={"button3 btn btn-accent"}>
                        <span className={"buttonText"}>
                            Create Smart Pool Key
                        </span>
                    </button>
                    <br/><br/>
                    </center>

        </div>

        var loading=(<div id={"loading"}>
        <img src="/images/wait.gif" />
        </div>)

        var page2=<div  id={"page2"} style={{padding:"10px"}}>
                    <div className={"row"}>
                        <div className={"col-md-12"}>    
                            <br/>
                            <center><label 
                                className={"title2"}>Pool Key Contract Address
                                    </label>
                            </center>
                            <br/>
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
                                                
                                                <div className={"row"}>
                                                    <div className={"col-md-12"}>
                                                        <center>
                                                        <label className={"label4"}>SMART POOL KEY ETH BALANCE</label>
                                                        <br/>
                                                        <h1><span className={"eth_balance"}></span></h1>
                                                        <font size={2}>ETH</font>
                                                    
                                                        <br/>
                                                        </center>
                                                    </div>
                                                </div>    
                                                <br/>                        
                                                <div className={"row distribute"} style={{display:"none"}}>
                                                    <div className={"col-md-12"}>
                                                        <a href='#' className={"btn btn-primary"} id={"distribute_ether"}>
                                                            Distribute Ether to Members
                                                        </a>
                                                    </div>
                                                </div>
                                                
                                                
                                            </div>
                                            <div className={"col-md-6"}>    
                                                
                                                <div className={"row"}>
                                                    <div className={"col-md-12"}>
                                                        <center>
                                                        <label className={"label4"}>ETH RECEIVED FROM POOL</label>
                                                        <h1><span className={"received"}></span></h1> 
                                                        <font size={2}>ETH</font>
                                                        </center>
                                                    </div>
                                                </div>                            
                                                
                                            </div>
                                        </div>
                                        
                                        <div className={"row"}>
                                            <div className={"col-md-12"}>
                                                    <br/><br/>
                                                    <h4>
                                                        
                                                        <div className={"progress m-progress--sm"}>
                                                            <div className={"progress-bar m--bg-accent"} 
                                                                role="progressbar" 
                                                                style={{height:"35px"}} 
                                                                aria-valuenow="0" 
                                                                aria-valuemin="0" 
                                                                aria-valuemax="100" >
                                                            <b><span className={"eth_sent"}></span></b>
                                                            </div>
                                                        </div>
                                                        
                                                    </h4>
                                                    <br/><br/>
                                            </div>
                                        </div>
                                        
                                        <div className={"row"}>
                                            <div className={"col-md-4"}>    
                                                <center>
                                                    <label className={"label4"}>MIN PER DONOR</label>
                                                    <h1><span className={"min_per_contrib"}></span></h1> 
                                                    <font size={2}>ETH</font>
                                                    <br/>
                                                </center>
                                                
                                            </div>
                                            <div className={"col-md-4"}>    
                                                <center>
                                                    <label className={"label4"}>MAX PER DONOR</label>
                                                    <h1><span className={"max_per_contrib"}></span></h1> 
                                                    <font size={2}> ETH</font>
                                                    <br/>
                                                </center>
                                                
                                            </div>
                                            <div className={"col-md-4"}>    
                                                <center>
                                                    <label className={"label4"}>MAX DONATION</label>
                                                    <h1><span className={"max_contrib"}></span></h1> 
                                                    <font size={2}> ETH</font>
                                                </center>                                                
                                            </div>
                                        </div>
                                        <div className={"row"}>
                                            <div className={"col-md-12"}>
                                                <br/><br/><br/>    
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                                </div>
                                <div className={"col-md-6"}>    
                                        <div className={"m-portlet m-portlet--tab"}>
                                            <div className={"m-portlet__head"} style={{padding:"10px"}}>     
                                                <br/>
                                                <div className={"row"}>
                                                    <div className={"col-md-12"}>
                                                        <center>
                                                        <label className={"status title3"}>
                                                            Status: Open
                                                        </label>
                                                        <br/>
                                                        
                                                        <div id={"contrib-stat"} style={{height: "250px"}}></div>
                                                        <br/>
                                                        </center>
                                                        </div>
                                                    </div>
                                                        <center>   
                                                    <div className={"row"}>
                                                        <div className={"col-md-6"}>
                                                            <label className={"label4"}>TRANSACTION FEE</label>
                                                            <h1><span className={"fee"}></span></h1>
                                                            <font size={2}>% Fee </font><br/>
                                                        </div>
                                                        <div className={"col-md-6"}>
                                                            <label className={"label4"}>ETH SENT TO POOL</label>
                                                            <h1><span className={"eth_sent"}></span></h1>
                                                            <font size={2}>ETH</font><br/>
                                                            <br/>
                                                        </div>
                                                    </div>                            
                                                    <div className={"row"}>
                                                        <div className={"col-md-12"}>
                                                            <div className={"input-group"}>
                                                                <input id={"send_amt"} 
                                                                style={{height:"40px"}} 
                                                                className={"form-control m-input m-input--air m-input--pill"} 
                                                                value={self.state.send_amt} 
                                                                onChange={(e) => {
                                                                    self.setState({send_amt:parseInt(e.target.value)})
                                                                }}
                                                                />
                                                                <a href='#' 
                                                                className={"btn btn-primary"} 
                                                                id={"send_ether"}>Send Ether
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <br/>

                                                    </center> 
                                                </div>
                                                    

                                            </div>
                                    </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-md-12"}>
                                    <div className={"m-portlet m-portlet--tab"}>
                                            <div className={"m-portlet__head"}>
                                                <br/>
                                                <center><label className={"title2"}>Transactions</label></center> 
                                                    <hr/>
                                                <div id={"transactions"}>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
        if (!self.state.page || self.state.page == 'page1')
            return page1;
        else if (self.state.page == 'loading')
            return loading;
        else if (self.state.page == 'page2')
            return page2;
    }
}
