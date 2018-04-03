require('babel-polyfill');

const GraphNode = artifacts.require("./GraphNode.sol");
const PublicOffering = artifacts.require("./PublicOffering.sol");
const SmartKey = artifacts.require("./SmartKey.sol");

var admins=[
            web3.eth.coinbase,
            web3.eth.accounts[1],
            ];


module.exports = async (deployer) => {
  // web3.toWei('1', 'ether')
  await deployer.deploy(PublicOffering, SmartKey.address, 1500000000, 1604790383, 1, 5000000000, admins);
  

};
        

        