require('babel-polyfill');

const Database = artifacts.require("./Database.sol");
const PublicOffering = artifacts.require("./PublicOffering.sol");
const SmartKey = artifacts.require("./SmartKey.sol");

var admins=[
            web3.eth.coinbase,
            ];

            
module.exports = async (deployer) => {
  
  await deployer.deploy(Database, SmartKey.address, admins);
  
};
        

        