require('babel-polyfill');

const PublicOffering = artifacts.require("./PublicOffering.sol");
const SmartKey = artifacts.require("./SmartKey.sol");
const SmartPoolKey = artifacts.require("./SmartPoolKey.sol");

var admins=[web3.eth.coinbase,
            ];
            
module.exports = async (deployer) => {

    SmartKey.deployed().then(function(contractInstance) {
        
        contractInstance.addAdmin(PublicOffering.address, {from:web3.eth.accounts[0]});
        contractInstance.addAdmin(SmartKey.address, {from:web3.eth.accounts[0]});
        contractInstance.addAdmin(SmartPoolKey.address, {from:web3.eth.accounts[0]});
        
    });

};
        

        