require('babel-polyfill');

const SmartKey = artifacts.require("./SmartKey.sol");
const SafeMath = artifacts.require("./math/SafeMath.sol");
const PublicOffering = artifacts.require("./PublicOffering.sol");
const Database = artifacts.require("./Database.sol");


module.exports = async (deployer) => {
    deployer.deploy(SafeMath, {gas: 1000000});
  
    deployer.link(SafeMath, [PublicOffering, SmartKey, Database]);
    
  };
  
        

        