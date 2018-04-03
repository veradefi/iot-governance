require('babel-polyfill');

const GraphNode = artifacts.require("./GraphNode.sol");
const PublicOffering = artifacts.require("./PublicOffering.sol");
const SmartKey = artifacts.require("./SmartKey.sol");
const SmartNodeItem = artifacts.require("./SmartNodeItem.sol");
const GraphRoot = artifacts.require("./GraphRoot.sol");

var admins=[
            web3.eth.coinbase,
            web3.eth.accounts[1],
            ];


module.exports = async (deployer) => {
//   await deployer.deploy(GraphNode, SmartKey.address, admins);

  await deployer.deploy(SmartNodeItem, GraphRoot.address, SmartKey.address, admins);

};
        

        