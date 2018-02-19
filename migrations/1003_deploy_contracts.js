require('babel-polyfill');

const Database = artifacts.require("./Database.sol");
const ICO = artifacts.require("./ICO.sol");
const SmartKey = artifacts.require("./SmartKey.sol");

var admins=[
            web3.eth.coinbase,
            ];

module.exports = async (deployer) => {
  
  await deployer.deploy(ICO, SmartKey.address, 1500000000, 1604790383, web3.toWei('1', 'ether'), 5000000000, 0, admins);
  

};
        

        