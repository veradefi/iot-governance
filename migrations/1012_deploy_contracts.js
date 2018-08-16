require('babel-polyfill');

const PublicOffering = artifacts.require("./PublicOffering.sol");
const SmartKey = artifacts.require("./SmartKey.sol");
const SmartPoolKey = artifacts.require("./SmartPoolKey.sol");
const SmartNode = artifacts.require("./SmartNode.sol");
const GraphRoot = artifacts.require("./GraphRoot.sol");

var admins=[
            web3.eth.coinbase,
            web3.eth.accounts[1],
            ];

            
module.exports = async (deployer) => {

    await SmartKey.deployed().then(function(contractInstance) {
        
        contractInstance.addAdmin(PublicOffering.address, {from:web3.eth.accounts[0]});
        contractInstance.addAdmin(SmartKey.address, {from:web3.eth.accounts[0]});
        contractInstance.addAdmin(SmartPoolKey.address, {from:web3.eth.accounts[0]});
        contractInstance.addAdmin(SmartNode.address, {from:web3.eth.accounts[0]});
        contractInstance.putSmartKey(GraphRoot.address, GraphRoot.address, {from:web3.eth.accounts[0]});

    });

};
        

        