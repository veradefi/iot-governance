import React, { Component } from 'react'

export default class Header extends Component {
  render() {
    return(
            <div className={"m-portlet__head"} style={{backgroundColor: "#ffffff", boxShadow: "0 2px 7px 0 rgba(160, 160, 160, 0.5)",
            boxShadow: "0 2px 7px 0 rgba(160, 160, 160, 0.5)",
            border: "solid 1px #e7e7e7"
            }}>
                    <div className={"row"}>
                        <div className={"col-md-12"} style={{height:"73px"}}>
                            <br/>
                            <div style={{float:"left"}}>
                             <a href={'/iotpedia/'}>
                             <img style={{marginLeft:"16px", height:"40px"}} alt={'Logo'} src={"images/logo.svg"} className={"Logo"} />
                             </a>
                            </div>
                            <div style={{float:"right"}}>
                             <a href={'/iotpedia/'}>
                                <img src={"images/home.svg"} className={"Home"} alt={'Home'} style={{marginRight:"16px"}} />
                            </a>
                            
                            </div>
                        </div>
                    </div>
                    <div style={{clear: "both"}}></div>​
             </div>
    )
  }
}
     

