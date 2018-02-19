// request
if (! window.hasPolyfill) {
  require("babel-polyfill");
  window.hasPolyfill=true;
}
var request = require('ajax-request');
// Import libraries we need.
import { default as Web3} from 'web3';
Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
var contract = require("truffle-contract");
import sk_artifacts from '../../build/contracts/SmartKey.json'
import db_artifacts from '../../build/contracts/Database.json'
    
var shajs = require('sha.js')

if (typeof eth_salt !== 'undefined') {
        
    var user="0x" + shajs('sha224').update(eth_salt).digest('hex');
    
    var bip39 = require("bip39");
    var hdkey = require('ethereumjs-wallet/hdkey');
    var ProviderEngine = require("web3-provider-engine");
    var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
    var Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
    
    // Get our mnemonic and create an hdwallet
    //var mnemonic = "supreme garlic enrich script blind grid biology oyster verify enter great gorilla";
    var hdwallet = hdkey.fromMasterSeed(user); //bip39.mnemonicToSeed(mnemonic + user));
    
    // Get the first account using the standard hd path.
    var wallet_hdpath = "m/44'/60'/0'/0/";
    var wallet = hdwallet.derivePath(wallet_hdpath + "0").getWallet();
    var address = "0x" + wallet.getAddress().toString("hex");
    var account = address;
    console.log(account);
    var providerUrl = "http://localhost:8666";
    var host=providerUrl;
    
    var engine = new ProviderEngine();
    engine.addProvider(new WalletSubprovider(wallet, {}));
    engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)));
    window.web3 = new Web3(engine);
    
    var SmartKey = contract(sk_artifacts);
    
    var DataBase = contract(db_artifacts);
    
    let tokenPrice = null;
    
    Database.setProvider(window.web3.currentProvider);
    SmartKey.setProvider(window.web3.currentProvider);
    engine.start(); // Required by the provider engine.

    window.buyTokens = function(tokensToBuy, price) {
      SmartKey.deployed().then(function(contractInstance) {
      
        contractInstance.buySmartKey({value: web3.toWei(price, 'ether'), from: account}).then(function(v) {
        
            web3.eth.getBalance(contractInstance.address, function(error, result) {
            
                console.log(result);
            
          });
        })
      });
    }
    
    window.balance = function() {
      SmartKey.deployed().then(function(contractInstance) {
            
                console.log('balance ' + account);
                contractInstance.getBalance({from: account}).then(function(v) {
                    console.log(v);                    
                });
        
      }); 
    }
    
    self.balance();

}

