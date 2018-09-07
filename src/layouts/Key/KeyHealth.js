import React, { Component } from 'react'
var $ = require ('jquery');

export default class KeyHealth extends Component {
  render() {
    var self=this;
    return(
      
        <div id={"health_dialog"}>
              <div id={"health"}>
                    <div className={"row"}>
                        <div className={"col-xs-12"}>
                            <br/>
                            <br/>
                            <br/>
                            <center>
                            <label className={"title4"} 
                                style={{width: "519px",height: "32px"}}>Update Device Integrity Status</label>
                            </center>
                            <br/>
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-xs-5"} style={{textAlign:"right"}}>
                            <label className={"label2"}>Status</label>
                        </div>
                        <div className={"col-xs-7"} style={{textAlign:"left"}}>
                            
                            <select id={"health_select"} 
                            style={{
                                maxWidth:"253px",
                                borderRadius:"5px",
                                border: "solid 1px #d8d8d8"
                            }} 
                            className={"form-control m-input m-input--air"} 
                            onChange={() => {
                                self.props.setHealth(parseInt($('#health_select').val()));
                            }}>
                                <option value={"0"} className={"m--font-primary"}>Provisioning</option>
                                <option value={"1"} className={"m--font-success"}>Certified</option>
                                <option value={"2"} className={"m--font-info"}>Modified</option>
                                <option value={"3"} className={"m--font-danger"}>Compromised</option>
                                <option value={"4"} className={"m--font-danger"}>Malfunctioning</option>
                                <option value={"5"} className={"m--font-danger"}>Harmful</option>
                                <option value={"6"} className={"m--font-danger"}>Counterfeit</option>
                            </select>
                            <br/>
                        </div>
                    </div> 
                    <div className={"row"}>
                        <div className={"col-xs-12"} style={{textAlign:"center"}}>    
                          <span className={"label3"}>The donation set for this transaction is <span className={"donate_amt"}>{this.props.donate_amt}</span> ETH.
                          </span>
                          <br/>
                          <br/>
                                   
                        </div>
                    </div>

                    <div className={"row"}>
                        <div className={"col-xs-12"}>
                            <center>
                            <button   
                            //style={{width: "384px",height:"56px"}}  
                            onClick={() => {
                                self.props.setHealth(parseInt($('#health_select').val()));
                            }}  
                            className={"form-control button3 btn btn-primary"} 
                            type={"button"}>
                            <span className={"buttonText"}>Update</span></button>
                            </center>
                            <br/><br/>
                        </div>
                    </div>
                </div>
                <div id={"health_loading"} style={{display:"none"}}>
                <center><img src="images/wait.gif" width={100} /></center>
                </div>
            </div>
    )
  }
}

