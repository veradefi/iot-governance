require('babel-polyfill');

const SmartNode = artifacts.require("./SmartNode.sol");
const SmartKey = artifacts.require("./SmartKey.sol");
const GraphRoot = artifacts.require("./GraphRoot.sol");

var admins=[
            web3.eth.coinbase,
            web3.eth.accounts[1],
            ];

            
            
module.exports = async (deployer) => {
  
  await deployer.deploy(SmartNode, GraphRoot.address, SmartKey.address, admins);

};
        

        