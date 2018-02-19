require('babel-register');
require('babel-polyfill');
var DefaultBuilder = require("truffle-default-builder");

/*
var bip39 = require("bip39");
var hdkey = require('ethereumjs-wallet/hdkey');
var ProviderEngine = require("web3-provider-engine");
var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
var Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
var Web3 = require("web3");

// Get our mnemonic and create an hdwallet
var mnemonic = "supreme garlic enrich script blind grid biology oyster verify enter great gorilla";
var hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));

// Get the first account using the standard hd path.
var wallet_hdpath = "m/44'/60'/0'/0/";
var wallet = hdwallet.derivePath(wallet_hdpath + "0").getWallet();
var address = "0x" + wallet.getAddress().toString("hex");

var providerUrl = "https://beginning.world/rpc_rinkeby/";
var engine = new ProviderEngine();
engine.addProvider(new WalletSubprovider(wallet, {}));
engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)));
engine.start(); // Required by the provider engine.
*/

module.exports = {
  build: new DefaultBuilder({
    "index.html": "index.html",
    "app.js": [
        "../node_modules/jquery/dist/jquery.min.js",
        "../node_modules/materialize-css/dist/js/materialize.min.js",
        "../node_modules/underscore/underscore-min.js",
        "javascripts/app.js"
    ],
    "app.css": [
        "../node_modules/materialize-css/dist/css/materialize.min.css",
        "stylesheets/app.scss"
    ],
    "images/": "images/",
    "fonts/" : "../node_modules/materialize-css/dist/font/"
   }),
  deploy: [
    "SmartKey",
    "Database",
    "PublicOffering"

  ],
  rpc: {
    host: "localhost", 
    port: 8545,
    
  },
  networks: {
    testrpc: {
      host: "localhost", 
      port: 8545,
      network_id: '*' // Match any network id,
      //provider: engine,
      //from: address 
    }, 
    
    development: {
      host: "localhost", 
      port: 8545,
      network_id: '*' // Match any network id,
      //provider: engine,
      //from: address 
    }, 
    prod: {
      host: "localhost", 
      port: 8777,
      network_id: '*' // Match any network id,
      //provider: engine,
      //from: address 
    },  
    rinkeby: {
      host: "localhost", 
      port: 8666,
      network_id: '*' // Match any network id
    }

  }
};

