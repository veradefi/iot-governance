import React, { Component } from 'react'
import Hidden from '@material-ui/core/Hidden';
import * as web3Utils from "../../util/web3/web3Utils";

import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import { connect, Provider } from "react-redux";
import ContractDAO from '../../util/web3/ContractDAO'
import AccountDAO from '../../util/web3/AccountDAO'
import { drizzleConnect } from 'drizzle-react'

class Header extends Component {
  render() {
    return(
        <Hidden smDown>

            <div className={"m-portlet__head"} style={{backgroundColor: "#ffffff", boxShadow: "0 2px 7px 0 rgba(160, 160, 160, 0.5)",
            boxShadow: "0 2px 7px 0 rgba(160, 160, 160, 0.5)",
            border: "solid 1px #e7e7e7"
            }}>
                    <div style={{width:"100%"}}>
                        <div style={{width:"100%"}} style={{height:"40px"}}>
                            <br/>
                            <div style={{float:"left"}}>
                             <a href={'/iotpedia/'}>
                             <img style={{marginLeft:"16px", height:"40px"}} alt={'Logo'} src={"images/logo.svg"} className={"Logo"} />
                             </a>
                            </div>
                            <div style={{marginTop: "16px", float:"right"}}>
                                    
                                    <a href={'/iotpedia/'}>
                                        <img src={"images/home.svg"} className={"Home"} alt={'Home'} style={{marginRight:"16px"}} />
                                    </a>
   
                            </div>
                            <div style={{float:"right", marginRight:"16px"} }>
                            
                                <pre style={{}}>
                                <span className={"label7 eth_balance"}>
                                <ContractDAO contract={"SmartKey"} 
                                                method="getBalance" 
                                                methodArgs={[this.props.accounts[0]]} 
                                                isLocaleString={true} />

                                </span>
                                <font size={2}> IOTBLOCK</font>
                                </pre>
                            </div>
                        </div>
                    </div>
                    <div style={{clear: "both"}}></div>​
             </div>
        </Hidden>
    )
  }
}
     

Header.contextTypes = {
    drizzle: PropTypes.object
  }
  
  
  const drizzleStateToProps = state => {
    return {
        drizzleStatus: state.drizzleStatus,
        accounts: state.accounts,
        contracts: state.contracts
  
    };
  };
  
  
  const drizzleDispatchToProps = dispatch => {
    return {
        addContract: (drizzle, poolcfg, events, web3) => {
            dispatch(actions.addContract(drizzle, poolcfg, events, web3));
        },
    };
  };
  
  
  
  
  export default drizzleConnect(Header,drizzleStateToProps, drizzleDispatchToProps)
  