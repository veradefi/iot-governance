require('babel-polyfill');

const ICO = artifacts.require("./ICO.sol");
const SmartKey = artifacts.require("./SmartKey.sol");

var admins=[web3.eth.coinbase,
            ];
            
module.exports = async (deployer) => {

    SmartKey.deployed().then(function(contractInstance) {
        
        contractInstance.addAdmin(ICO.address, {from:web3.eth.accounts[0]});
        
    });

};
        

        