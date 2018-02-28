require('babel-polyfill');

const SmartKey = artifacts.require("./SmartKey.sol");
const SafeMath = artifacts.require("./math/SafeMath.sol");
const PublicOffering = artifacts.require("./PublicOffering.sol");
const GraphNode = artifacts.require("./GraphNode.sol");


module.exports = async (deployer) => {
    deployer.deploy(SafeMath);
  
    deployer.link(SafeMath, [PublicOffering, SmartKey]);
    
  };
  
        

        