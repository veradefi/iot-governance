require('babel-polyfill');

const GraphNode = artifacts.require("./GraphNode.sol");
const PublicOffering = artifacts.require("./PublicOffering.sol");
const SmartKey = artifacts.require("./SmartKey.sol");
const SmartNodeItem = artifacts.require("./SmartNodeItem.sol");

var admins=[
            web3.eth.coinbase,
            ];

module.exports = async (deployer) => {
//   await deployer.deploy(GraphNode, SmartKey.address, admins);

  await deployer.deploy(SmartNodeItem, SmartKey.address, admins);

};
        

        