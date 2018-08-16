import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

/*
 * Create component.
 */

class ContractDAO extends Component {
  constructor(props, context) {
    super(props)

    this.contracts = context.drizzle.contracts

    // Get the contract ABI
    const abi = this.contracts[this.props.contract].abi;

    // Fetch initial value from chain and return cache key for reactive updates.
    var methodArgs = this.props.methodArgs ? this.props.methodArgs : []
    var methodArgs2 = this.props.methodArgs2 ? this.props.methodArgs2 : []
    this.dataKey = this.contracts[this.props.contract].methods[this.props.method].cacheCall(...methodArgs)
    if (this.props.morris) {
        this.dataKey2 = this.contracts[this.props.contract].methods[this.props.method2].cacheCall(...methodArgs2)

     }
  }

  componentDidMount() {
      
  }
  precisionRound(number, precision) {
    var factor = Math.pow(10, precision)
    return Math.round(number * factor) / factor
  }

  render() {
    // Contract is not yet intialized.
    if(!this.props.contracts[this.props.contract].initialized) {
      return (
        <span>🔄</span>
      )
    }

    // If the cache key we received earlier isn't in the store yet; the initial value is still being fetched.
    if(!(this.dataKey in this.props.contracts[this.props.contract][this.props.method])) {
      return (
        <span>🔄</span>
      )
    }

    if (this.props.contracts[this.props.contract][this.props.method][this.dataKey].error) {
        //alert('undefined obj')
        console.log(this.dataKey)
        console.log(this.props.contracts[this.props.contract][this.props.method][this.dataKey])
        return (
            <span></span>
          ) 

    }
    // Show a loading spinner for future updates.
    var pendingSpinner = this.props.contracts[this.props.contract].synced ? '' : ' 🔄'

    // Optionally hide loading spinner (EX: ERC20 token symbol).
    if (this.props.hideIndicator) {
      pendingSpinner = ''
    }

    var displayData=this.props.contracts[this.props.contract][this.props.method][this.dataKey].value

  

    // Optionally convert to UTF8
    if (this.props.toUtf8) {
      displayData = this.context.drizzle.web3.utils.hexToUtf8(displayData)
    }

    // Optionally convert to Ascii
    if (this.props.toAscii) {
      displayData = this.context.drizzle.web3.utils.hexToAscii(displayData)
    }

    const units = this.props.units ? this.props.units.charAt(0).toUpperCase() + this.props.units.slice(1) : 'Wei'

    // Convert to given units.
    if (this.props.units) {
        displayData = this.context.drizzle.web3.utils.fromWei(displayData, this.props.units)
    }

    // Adjust to given precision.
    if (this.props.precision) {
        displayData = this.precisionRound(displayData, this.props.precision)
    }

    if (this.props.value_post_process) {
        displayData=this.props.value_post_process(displayData)
        return displayData;
    }
    if (this.props.morris) {
        if(!(this.dataKey2 in this.props.contracts[this.props.contract][this.props.method2])) {
            return (
              <span>🔄</span>
            )
        }
        var displayData2=this.props.contracts[this.props.contract][this.props.method2][this.dataKey2].value
        // Convert to given units.
        if (this.props.units) {
            displayData2 = this.context.drizzle.web3.utils.fromWei(displayData2, this.props.units)
        }

        // Adjust to given precision.
        if (this.props.precision) {
            displayData2= this.precisionRound(displayData2, this.props.precision)
        }

        /*
        setTimeout(
            function() {
                window.Morris.Donut({
                    element: this.props.morris,
                    data: [
                    {label: this.props.morris_label, value: displayData},
                    {label: this.props.morris_label2, value:  displayData2},
                    ]
                });
            }
            .bind(this),
            3000
        );
        */
        return <div id={this.props.morris} style={{height: "230px"}} >
        <img src={"images/wait.gif"} width={10} onLoad={() => {
            window.Morris.Donut({
                element: this.props.morris,
                data: [
                {label: this.props.morris_label, value: displayData},
                {label: this.props.morris_label2, value:  displayData2},
                ]
            });
        }} />
        </div>
                                                        
     }
     if (this.props.hideOnFalse) {
         if (!displayData) {
            
             return <span style={{display:"none"}}></span>
         }
     }
     if (this.props.hideOnTrue) {
        if (displayData) {
           
            return <span style={{display:"none"}}></span>
        }
    }
   if (this.props.button) {
        return <a href='#' className={"btn btn-primary"} 
        id={this.props.button}
        onClick={this.props.button_action}
        >{this.props.button_label}</a>
    }

    // If return value is an array
    if (this.props.length) {
        //console.log(displayData);
        //alert(displayData);
        displayData=displayData.length;
        return <span>{`${displayData}`}{pendingSpinner}</span>
    }

    if (typeof displayData === 'array') {
    
      const displayListItems = displayData.map((datum, index) => {
        <li key={index}>{`${datum}`}{pendingSpinner}</li>
      })

      return(
        <ul>
          {displayListItems}
        </ul>
      )
    }

    // If retun value is an object
    if (typeof displayData === 'object') {
      if (this.props.object_values && this.props.object_labels && this.props.object_values_post_process && this.props.object_classes) {
        var self=this;
        var items=[];
        var idx=0;
        this.props.object_values.map((field) => {
            var item={'label': this.props.object_labels[idx],
                      'value': this.props.object_values_post_process[idx](displayData[field]),
                      'class': this.props.object_classes[idx]}
            items.push(item);
            idx+=1;
        });
        var htmls=[];
        var html = <div key={"rowItem"} className={"row label8"} style={{padding:"10px"}}>
                        {items.map(item => {
                            return <div key={item.label} className={item.class}>
                                        <b>{item.label}</b><br/>
                                        {item.value}
                                    </div>
                        })}
                    </div>
        htmls.push(html);        
        if (self.props.object_add_hr) {
            var html2=<div key={"rowItem2"}><hr/><br/></div>
            htmls.push(html2);
        } 
        return htmls;
        
      }
      
    var i = 0
      const displayObjectProps = []


      Object.keys(displayData).forEach((key) => {
        if (i != key) {
          displayObjectProps.push(<li key={i}>
            <strong>{key}</strong>{pendingSpinner}<br/>
            {`${displayData[key]}`}
          </li>)
        }

        i++
      })

      
      return(
        <ul>
          {displayObjectProps}
        </ul>
      )
    }

    return(
      <span>{`${displayData}`}{pendingSpinner}</span>
    )
  }
}

ContractDAO.contextTypes = {
  drizzle: PropTypes.object
}

/*
 * Export connected component.
 */

const mapStateToProps = state => {
  return {
    contracts: state.contracts
  }
}

export default drizzleConnect(ContractDAO, mapStateToProps)