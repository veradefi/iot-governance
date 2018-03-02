require('babel-polyfill');

const GraphNode = artifacts.require("./GraphNode.sol");
const PublicOffering = artifacts.require("./PublicOffering.sol");
const SmartKey = artifacts.require("./SmartKey.sol");

var admins=[
            web3.eth.coinbase,
            ];

module.exports = async (deployer) => {
  
  await deployer.deploy(PublicOffering, SmartKey.address, 1500000000, 1604790383, web3.toWei('1', 'ether'), 5000000000, admins);
  

};
        

        