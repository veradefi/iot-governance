require('babel-polyfill');

const PublicOffering = artifacts.require("./PublicOffering.sol");
const SmartKey = artifacts.require("./SmartKey.sol");

var admins=[web3.eth.coinbase,
            ];
            
module.exports = async (deployer) => {

    SmartKey.deployed().then(function(contractInstance) {
        
        contractInstance.addAdmin(PublicOffering.address, {from:web3.eth.accounts[0]});
        
    });

};
        

        