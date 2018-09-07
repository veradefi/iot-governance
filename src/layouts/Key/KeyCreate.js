import React, { Component } from 'react'

export default class KeyCreate extends Component {

  render() {
      var self=this;
    return(
      
        <div id={"page1"}>
            <div className={"row"}>
                <div className={"col-xs-12"}>    
                            <center>
                                <div className={"row"}>
                                    <div className={"col-xs-12"}>
                                            <br/><br/>
                                            <center><label className={"title1"}>Create Smart Key<br/>(Rinkeby Ethereum Network)</label></center>
                                            <br/>
                                            
                                            
                                    </div>
                                </div>
                                <div className={"row"}>
                                    <div className={"col-xs-12"}>
                        
                                        <div className={"row"}>
                                            <div className={"col-xs-1"}>
                                    
                                            
                                            </div>
                                            <div className={"col-xs-3"}>
                                                        <label className={"label2"}>Your wallet address:</label>
                                            </div>
                                            <div className={"col-xs-7"}>
                                                        <input name="address" className={"address_val inputbox3 form-control m-input m-input--air"}  
                                                        style={{width:"100%"}} 
                                                        type={"text"} 
                                                        id={"address"} 
                                                        placeholder={""} 
                                                        value={this.props.address}
                                                        onChange={() => {
                                                        }}
                                                     />
                                            </div>
                                        </div>
                    
                                    </div>
                                </div>
                                            
                                <div className={"row"}>
                                    <div className={"col-xs-12"} style={{textAlign:'center'}}>    
                                        <br/>
                                            <label className={"label3"}>1 ETH is the minimum ETH needed to create Smart Key.</label>
                                    </div>
                                </div>
                                <br/>
                                
                        
                                <div className={"row"}>
                                    <div className={"col-xs-12"}>    
                                        <button type={"button"} 
                                        id={'pool'} 
                                        onClick={
                                            () => {
                                                self.props.createSmartKey();
                                            }
                                        }
                                        className={"button3 btn btn-accent"}>
                                            <span 
                                                className={"buttonText"}>Create Smart Key</span></button>
                                             <br/><br/>
                                             <a href='/' className={"link2"}>Go back to home</a>
                                    
                                    </div>
                                </div>
                        </center>
                </div>
            </div>
        </div>
    )
  }
}

