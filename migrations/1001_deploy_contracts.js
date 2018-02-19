require('babel-polyfill');

const Database = artifacts.require("./Database.sol");
const ICO = artifacts.require("./ICO.sol");
const SmartKey = artifacts.require("./SmartKey.sol");

var admins=[
            web3.eth.coinbase,
            ];

module.exports = async (deployer) => {
  
  await deployer.deploy(SmartKey,  4000000000, web3.toWei('1', 'ether'), admins).then(function() {
      
  });

};
        

        