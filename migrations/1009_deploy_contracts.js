require('babel-polyfill');


const SmartKey = artifacts.require("./SmartKey.sol");

const SmartPoolKey = artifacts.require("./SmartPoolKey.sol");

var admins=[
            web3.eth.coinbase,
            ];

module.exports = async (deployer) => {

  await deployer.deploy(SmartPoolKey, SmartKey.address, admins).then(function() {
      
  });

};
        

        