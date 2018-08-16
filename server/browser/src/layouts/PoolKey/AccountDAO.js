import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

/*
 * Create component.
 */

class AccountDAO extends Component {
  constructor(props, context) {
    super(props);

    this.precisionRound = this.precisionRound.bind(this);

  }

  componentDidMount() {
    var self=this;
    if (this.props.getBalance) {
        this.address=this.props.getBalance
        this.context.drizzle.web3.eth.getBalance(self.props.getBalance).then(function (eth_amount) {
            self.balance=eth_amount;
            self.units = self.props.units ? self.props.units.charAt(0).toUpperCase() + self.props.units.slice(1) : 'Wei'

            // Convert to given units.
            if (self.props.units) {
                self.balance = self.context.drizzle.web3.utils.fromWei(self.balance, self.props.units)
            }

            // Adjust to given precision.
            if (self.props.precision) {
                self.balance = self.precisionRound(self.balance, self.props.precision)
            }
            self.hasData=true;
            self.forceUpdate();

        })

    } else {
        this.address=this.props.accounts[this.props.accountIndex]
        this.balance=this.props.accountBalances[this.address]

        this.units = this.props.units ? this.props.units.charAt(0).toUpperCase() + this.props.units.slice(1) : 'Wei'

        // Convert to given units.
        if (this.props.units) {
          this.balance = this.context.drizzle.web3.utils.fromWei(this.balance, this.props.units)
        }

        // Adjust to given precision.
        if (this.props.precision) {
            this.balance = this.precisionRound(self.balance, this.props.precision)
        }
        self.forceUpdate();
    }
    

  }
  precisionRound(number, precision) {
    var factor = Math.pow(10, precision)
    return Math.round(number * factor) / factor
  }

  render() {
    // No accounts found.
    var address = this.address;
    var balance = this.balance;
    var units = this.units;
    if(Object.keys(this.props.accounts).length === 0) {
      return (
        <span>🔄</span>
      )
    }

    // Get account address and balance.

    if (this.props.getBalance) {
        if (this.hasData)
            return(
                <span>{balance}</span>
            );
        else
          return (
            <span>🔄</span>
          )
    

     
    } else {
        return(
        <div>
            <h4>{address}</h4>
            <p>{balance} {units}</p>
        </div>
        )
    }
  }
}

AccountDAO.contextTypes = {
  drizzle: PropTypes.object
}

/*
 * Export connected component.
 */

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    accountBalances: state.accountBalances    
  }
}

export default drizzleConnect(AccountDAO, mapStateToProps)