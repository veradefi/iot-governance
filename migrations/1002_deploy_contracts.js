require('babel-polyfill');

const GraphNode = artifacts.require("./GraphNode.sol");
const PublicOffering = artifacts.require("./PublicOffering.sol");
const SmartKey = artifacts.require("./SmartKey.sol");

var admins=[
            web3.eth.coinbase,
            ];

            
module.exports = async (deployer) => {
  
  await deployer.deploy(GraphNode, SmartKey.address, admins[0], admins);
  
};
        

        