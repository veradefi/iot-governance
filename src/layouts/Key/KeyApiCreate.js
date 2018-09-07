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
                                          <center><label className={"title1"}>Create Smart Key API Access Token<br/>(Rinkeby Ethereum Network)</label></center>
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
                                <div className={"col-xs-4"} style={{textAlign:"center"}}>
                        
                                  <label className={"label2"}>Your wallet address:</label>
                                  
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-xs-12"} style={{textAlign:"center"}}>
                                    <div  style={{maxWidth: "80%",height: "30px"}} className={"border2"}>
                                             <center>
                                             <span className={"address label2"}>{this.props.address}</span>
                                             </center>
                                    </div>
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
                        
                                  <label className={"label2"}>Email</label>
                                  
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
                        
                                  <label className={"label2"}>Select Password</label>
                                  
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

