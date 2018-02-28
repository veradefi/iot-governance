require('babel-polyfill');

const Catalogue = artifacts.require("./Catalogue.sol");
const CatalogueItem = artifacts.require("./CatalogueItem.sol");
const GraphNode = artifacts.require("./GraphNode.sol");
const GraphRoot = artifacts.require("./GraphRoot.sol");
const PublicOffering = artifacts.require("./PublicOffering.sol");
const SmartKey = artifacts.require("./SmartKey.sol");

var admins=[
            web3.eth.coinbase,
            ];

            
module.exports = async (deployer) => {
  
  await deployer.deploy(GraphRoot, SmartKey.address, admins);
  //deployer.deploy(CatalogueItem, SmartKey.address, admins);
  //await deployer.deploy(Catalogue, SmartKey.address, admins);
};
        

        