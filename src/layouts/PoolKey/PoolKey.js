import React, { Component } from 'react'
import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import * as web3Utils from "../../util/web3/web3Utils";
import {Springy, Graph, Node} from "springy";
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import ContractDAO from '../../util/web3/ContractDAO'
import AccountDAO from '../../util/web3/AccountDAO'
import { drizzleConnect } from 'drizzle-react'
import PoolKeyContract from '../../solc/contracts/PoolKey.json'
import BigNumber from 'bignumber.js';

var $ = require ('jquery');
var eth1_amount=1000000000000000000;


const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  

class PoolKey extends Component {
    static propTypes = {
        showDialog:PropTypes.func.isRequired,
        closeDialog:PropTypes.func.isRequired,
        api_auth: PropTypes.string.isRequired,
        api_key: PropTypes.string.isRequired,
        eth_contrib: PropTypes.number.isRequired,
        isAuthenticated: PropTypes.bool.isRequired,
        init_address:PropTypes.string,
        isNode:PropTypes.bool,
    };
    constructor(props, context) {
        super(props)
        var self=this;
        console.log(props.drizzleStatus)
        console.log(context.drizzle)
        var drizzleState=context.drizzle.store.getState()
        this.contracts = context.drizzle.contracts

        this.state={
            transferAmt:1,
            isSmartKey:false,
            isBrowse:false,
            isWeb:false,
            isPool:true,
            max_contrib:1000000,
            max_per_contrib:100000,
            min_per_contrib:1,
            fee:5,
            auto:"0",
            send_amt:1,   
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
          
           //console.log(eth_sent, contrib_total, max_contrib, max_per_contrib, min_per_contrib, fee);
           //$('.eth_balance').html('' + eth_balance);
           //$('.eth_sent').html(eth_sent);
           //$('.max_contrib').html( max_contrib);
           //$('.max_per_contrib').html(max_per_contrib);
           //$('.min_per_contrib').html(min_per_contrib);
           //$('.fee').html(fee);
           //$('.received').html(received);
           //$('.progress-bar').val(eth_sent/max_per_contrib * 100);
           //$('#poolkey').html('<pre>' + address + '</pre>');
           /*if ( contrib_total || max_contrib) {
           window.Morris.Donut({
              element: 'contrib-stat',
              data: [
                {label: "Member Donated ETH", value: contrib_total},
                {label: "Max Contribution", value:  max_contrib},
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
           
           if (!autoDistribute) {
               $('.distribute').show();
           }
            
           $('#distribute_ether').html('Distribute Balance to ' + members.length + ' Members');
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
            */
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
       var poolcfg=Object.assign({}, web3Utils.get_pool_contract_cfg(address));
       var events=[];
       var web3=web3Utils.get_web3();
       var drizzle=this.context.drizzle;
       //this.context.drizzle.addContract({poolcfg, events})
       
       this.props.addContract(drizzle, poolcfg, events, web3) 
       self.setState({poolkey_addr:address});

       //web3Utils.get_pool(address, self.fill_page2);
       //$('#transactions').html('');
       //web3Utils.get_pool_transactions(address, self.fill_page2_transactions);
       self.setState({page:'page2'})
    }
    
    
  getKeyStatus = () => {
    var self=this;
      
    var eth_salt = web3Utils.getCookie('iotcookie');
    if (window.eth_salt) {
        eth_salt=window.eth_salt;
    }
    if (eth_salt == null) {
        web3Utils.setCookie('iotcookie',new Date().toUTCString(),7);
        eth_salt = web3Utils.getCookie('iotcookie');
    }
    
    
    var check_key=function(address) {
        console.log('address' + address);
        self.setState({beneficiary:address, admin1:address})
        
    }

    web3Utils.init_wallet(eth_salt, check_key);
    
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
            
            var beneficiary=self.state.beneficiary;
            var autoDistribute=true;
            if ($('#auto').find('option:selected').val() == '1') {
                autoDistribute=false;
            }
            self.setState({page:'loading'})

            // $('#page1').hide();
            // $('#loading').show();
            // $('#page2').hide();
             
            self.add_pool(beneficiary, 
                max_contrib, max_per_contrib, min_per_contrib, admins, has_whitelist, fee, autoDistribute, self.page2);

            
       
        });
        $('#fee').trigger('change');
    
    
        var find_key=getParameterByName('key'); 
        if (find_key) {
            self.page2(find_key);
        }
        
        this.getKeyStatus();

    }
    
    add_pool = (beneficiary, 
        max_contrib, max_per_contrib, min_per_contrib, admins, has_whitelist, fee, autoDistribute, callback) => {
        var self=this;

        this.setState({loading:true})
        var drizzleState=this.context.drizzle.store.getState()
        var smartNode="SmartPoolKey";
        var method="addSmartPoolKey";

        max_contrib= new BigNumber(max_contrib);
        max_per_contrib= new BigNumber(max_per_contrib);
        min_per_contrib= new BigNumber(min_per_contrib);
           
        if (fee == 'Infinity' || fee < 1) 
              fee=1;
              
        console.log(beneficiary + ' , ' + max_contrib + ' , ' + max_per_contrib + ' , ' + min_per_contrib + ' , ' + admins + ' , ' + has_whitelist + ' , ' + fee);
          
        var contrib=Math.round(parseFloat(self.props.eth_contrib)*eth1_amount);
        //alert(contrib);
        this.contracts[smartNode].methods.addSmartPoolKey(beneficiary, max_contrib, max_per_contrib, min_per_contrib, 
            admins, has_whitelist, fee, autoDistribute).send( 
        {from: drizzleState.accounts[0],  value: contrib, gasPrice:23000000000
        })
        .then(function(address)  {
            self.contracts[smartNode].methods.getSmartPoolKey(beneficiary).call(
            {from: drizzleState.accounts[0]
            })
            .then(function(address)  {
                self.setState({loading:false})
                console.log(address);
                callback(address);
            });

        }).catch(function(error) {
            self.setState({loading:false})
                
            alert("Could not complete transaction")
            alert(error);
            console.log(error);
        });
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
                
                                 <input 
                                  className={"inputbox3 form-control m-input m-input--air"}  
                                  type="text"
                                  onChange={(e) => {
                                    console.log(e.target.value);
                                    self.setState({beneficiary:e.target.value})
                                  }}
        
                                  id={"beneficiary"} 
                                  value={self.state.beneficiary}
                                  />
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
                          
                          <input 
                          className={"form-control m-input m-input--air m-input--pill"}  
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

                            <center><h3><span id={"poolkey"}><pre>{self.state.poolkey_addr}</pre></span></h3></center>

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
                                                        <h1><span className={"eth_balance"}>

                                                        </span>
                                                        <AccountDAO contract={self.state.poolkey_addr} 
                                                        getBalance={self.state.poolkey_addr}
                                                        units="ether" precision="3" />
                                                        
                                                        </h1>
                                                        <font size={2}>ETH</font>
                                                    
                                                        <br/>
                                                        </center>
                                                    </div>
                                                </div>    
                                                <br/>                        
                                                <div className={"row distribute"}>
                                                    <div className={"col-md-12"}>
                                                        <center>
                                                        <ContractDAO contract={self.state.poolkey_addr} 
                                                        button={"distribute_ether"}
                                                        button_label={
                                                            <div> Distribute Ether to &nbsp;
                                                                <ContractDAO contract={self.state.poolkey_addr} 
                                                                    method="getMembers"
                                                                    length={true} 
                                                                    methodArgs={[]} />
                                                                    &nbsp; Members 
                                                            </div> }
                                                        button_action={
                                                            () => {
                                                            var eth1=1000000000000000000;
                                                            //$('#page1').hide();
                                                            //$('#loading').show();
                                                            //$('#page2').hide();
                                                            self.setState({page:'loading'})
                                                  
                                                       
                                                            const done_sending= (res) => {
                                                                //$('#page1').hide();
                                                                //$('#loading').hide();
                                                                //$('#page2').show();
                                                                self.setState({page:'page2'})
                                                              
                                                            }
                                                            web3Utils.distribute_pool_ether(self.state.poolkey_addr, done_sending);
                                                        }}
                                                        method={"autoDistribute"}
                                                        hideOnTrue={true}
                                                        />
                                                        </center>
                                                    </div>
                                                </div>
                                                
                                                
                                            </div>
                                            <div className={"col-md-6"}>    
                                                
                                                <div className={"row"}>
                                                    <div className={"col-md-12"}>
                                                        <center>
                                                        <label className={"label4"}>ETH RECEIVED FROM POOL</label>
                                                        <h1><span className={"received"}>
                                                        </span>
                                                        <ContractDAO contract={self.state.poolkey_addr} 
                                                        method="received" 
                                                        methodArgs={[self.props.accounts[0]]} 
                                                        units="ether" precision="3" />
                                                        
                                                        </h1> 
                                                        
                                                        <font size={2}>ETH</font>
                                                        </center>
                                                    </div>
                                                </div>                            
                                                
                                            </div>
                                        </div>
                                        
                                        <div className={"row"}>
                                            <div className={"col-md-12"}>
                                                    <hr/>
                                            </div>
                                        </div>
                                        
                                        <div className={"row"}>
                                            <div className={"col-md-4"}>    
                                                <center>
                                                    <label className={"label4"}>MIN PER DONOR</label>
                                                    <h1><span className={"min_per_contrib"}></span>
                                                    <ContractDAO contract={self.state.poolkey_addr} 
                                                        method="min_per_contrib" 
                                                        methodArgs={[]} 
                                                        units="ether" precision="3" />
                                                    </h1> 
                                                    <font size={2}>ETH</font>
                                                    <br/>
                                                </center>
                                                
                                            </div>
                                            <div className={"col-md-4"}>    
                                                <center>
                                                    <label className={"label4"}>MAX PER DONOR</label>
                                                    <h1><span className={"max_per_contrib"}></span>
                                                    <ContractDAO contract={self.state.poolkey_addr} 
                                                        method="max_per_contrib" 
                                                        methodArgs={[]} 
                                                        units="ether" precision="3" />

                                                    </h1> 
                                                    <font size={2}> ETH</font>
                                                    <br/>
                                                </center>
                                                
                                            </div>
                                            <div className={"col-md-4"}>    
                                                <center>
                                                    <label className={"label4"}>MAX DONATION</label>
                                                    <h1><span className={"max_contrib"}></span>
                                                    <ContractDAO contract={self.state.poolkey_addr} 
                                                        method="max_contrib" 
                                                        methodArgs={[]} 
                                                        units="ether" precision="3" />

                                                    </h1> 
                                                    <font size={2}> ETH</font>
                                                </center>                                                
                                            </div>
                                            
                                        </div>
                                        <div className={"row"}>
                                                        <div className={"col-md-12"}>
                                                            <hr/>
                                                        </div>
                                        </div>
                                        <div className={"row"}>
                                                        <div className={"col-md-12"}>
                                                            <br/>
                                                            <div style={{padding:"10px"}}>
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
                                                                    onClick={() => {
                                                                        var eth1=1000000000000000000;
                                                                        var amt=self.state.send_amt * eth1;
                                                                        web3Utils.send_ether(self.state.poolkey_addr, amt);
                                                                    }}
                                                                    className={"btn btn-primary"} 
                                                                    id={"send_ether"}>Send Ether
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <br/>
                                                            <br/>

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
                                                        <ContractDAO contract={self.state.poolkey_addr} 
                                                        morris={"contrib_stat"}
                                                        morris_label={"Members Donated"}
                                                        method={"contrib_amount"}
                                                        morris_label2={"Max Donation"}
                                                        method2={"max_contrib"}
                                                        methodArgs={[]} 
                                                        methodArgs2={[]} 
                                                        units="ether" precision="3" />
                                                        <br/>
                                                        </center>
                                                        </div>
                                                    </div>
                                                        <center>   
                                                    <div className={"row"}>
                                                        <div className={"col-md-6"}>
                                                            <label className={"label4"}>TRANSACTION FEE</label>
                                                            <h1><span className={"fee"}></span>
                                                            <ContractDAO contract={self.state.poolkey_addr} 
                                                        method="fee" 
                                                        //methodArgs={[]} 
                                                        value_post_process={(val) => {
                                                            return 1/parseFloat(val.toString()) * 100
                                                        }} />
                                                            </h1>
                                                            <font size={2}>% Fee </font><br/>
                                                        </div>
                                                        <div className={"col-md-6"}>
                                                            <label className={"label4"}>ETH SENT TO POOL</label>
                                                            <h1><span className={"eth_sent"}></span>
                                                            <ContractDAO contract={self.state.poolkey_addr} 
                                                        method="isMember" 
                                                        methodArgs={[self.props.accounts[0]]} 
                                                        units="ether" precision="3" />

                                                            </h1>
                                                            <font size={2}>ETH</font><br/>
                                                            <br/>
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
                                                <ContractDAO contract={self.state.poolkey_addr} 
                                                    method="getTransactionCount"
                                                    methodArgs={[self.props.accounts[0]]}
                                                    value_post_process={(val)=> {
                                                        var items=[];
                                                        for (var i=val -1; i>= 0; i--) {
                                                            var idx=i;
                                                            items.push(<ContractDAO key={idx} contract={self.state.poolkey_addr} 
                                                            method="transactions" 
                                                            methodArgs={[self.props.accounts[0], idx]}
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
                                              
                                                        
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
        if (!self.state.page || self.state.page == 'page1')
            return page1;
        else if (self.state.page == 'loading')
            return loading;
        else if (self.state.page == 'page2') {
            //console.log(self.props.drizzleStatus)
            if (self.props.drizzleStatus.initialized && 
                self.state.poolkey_addr &&
                this.props.contracts[self.state.poolkey_addr] && 
                this.props.contracts[self.state.poolkey_addr].synced)
                return page2;
            else
                return loading;
        }
    }
}

PoolKey.contextTypes = {
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
  
  
  
  
export default connect( stateToProps, dispatchToProps)( drizzleConnect(PoolKey,drizzleStateToProps, drizzleDispatchToProps))
