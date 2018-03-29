require('babel-polyfill');

const GraphNode = artifacts.require("./GraphNode.sol");
const PublicOffering = artifacts.require("./PublicOffering.sol");
const SmartKey = artifacts.require("./SmartKey.sol");

var admins=[
            web3.eth.coinbase,
            ];

module.exports = async (deployer) => {
  // web3.toWei('1', 'ether')
  await deployer.deploy(SmartKey,  4000000000, 1, admins).then(function() {
      
  });

};
        

        