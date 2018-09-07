import React, { Component } from 'react'

export default class KeyApiCreate extends Component {
  render() {
    return(
      
        <div id={"page2_api"} >
            <div className={"row"}>
               <div className={"col-xs-12"}>    
                      <center>
                            <div className={"row"}>
                                <div className={"col-xs-12"}>
                                          <br/>
                                          <center><label className={"title1"} style={{ fontSize: "16px" }}>
                                          Create Smart Key API Access Token<br/>
                                          (Rinkeby Ethereum Network)
                                          </label></center>
                                          <br/>                                                                                  
                                 </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-xs-12"}>
                    
                                  <label className={"title3"}>
                                    Wallet
                                  </label>
                                  <br/><br/>
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-xs-12"} style={{textAlign:"center"}}>
                        
                                  <label className={"label2"}>Your wallet address:</label>
                                  
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-xs-12"} style={{textAlign:"center"}}>
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
                            <div className={"row"}>
                                <div className={"col-xs-12"}>
                                  <br/>
                                  <label className={"title3"}>
                                    API Key
                                  </label>
                                  <br/><br/>
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-xs-4"} style={{textAlign:"right"}}>
                        
                                  <label 
                                  className={"label2"}
                                  style={{ fontSize:"12px" }}

                                  >Email</label>
                                  
                                </div>
                                <div className={"col-xs-8"} style={{textAlign:"left"}}>
                                  
                                  <input name="username" className={"form-control m-input m-input--air m-input--pill"}  
                                  type={"text"} id={"username"} 
                                  placeholder={""} 
                                  />
                              
                                 </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-xs-4"} style={{textAlign:"right"}}>
                        
                                  <label 
                                  className={"label2"} 
                                  style={{ fontSize:"12px" }}
                                  >Select Password</label>
                                  
                                </div>
                                <div className={"col-xs-8"} style={{textAlign:"left"}}>
                                  
                                  <input name="password" className={"form-control m-input m-input--air m-input--pill"}  
                                  type={"password"} id={"password"} 
                                  placeholder={""}
                                  />
                                  <br/><br/>
                                 </div>
                            </div>
                            
                    
                            <div className={"row"}>
                                <div className={"col-xs-12"}>    
                                    <button type={"button"} id={'create_api_key'} className={"button3 btn btn-accent"}>
                                    <span className={"buttonText"}
                                    onClick={
                                      () => {
                                          this.props.createApiKey();

                                      }
                                    }
                                  >Create Smart Key Access Token</span></button>
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

