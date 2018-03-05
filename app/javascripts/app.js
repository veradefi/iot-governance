// request
if (typeof eth_salt == 'undefined') {

  require("babel-polyfill");
  window.hasPolyfill=true;
  console.log("Babel Polyfill included")

}
var request = require('ajax-request');
var jQuery = require('jquery');
// Import libraries we need.
import { default as Web3} from 'web3';
Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
var contract = require("truffle-contract");
import sk_artifacts from '../../build/contracts/SmartKey.json'
import db_artifacts from '../../build/contracts/GraphRoot.json'
import node_artifacts from '../../build/contracts/GraphNode.json'
import meta_artifacts from '../../build/contracts/MetaData.json'
import item_artifacts from '../../build/contracts/CatalogueItem.json'
    
var shajs = require('sha.js')

function init_wallet(eth_salt) 
{
    if (typeof eth_salt !== 'undefined') {
            
        var providerUrl = "https://iotblock.io/rpc/";
        var host=providerUrl;
        
	var hasAccount=false;
        if (typeof web3 !== 'undefined') {
          Web3.web3Provider = web3.currentProvider;
          web3 = new Web3(web3.currentProvider);
          window.web3=web3;
          
          web3.eth.getAccounts().then(function(accounts) {
              window.accounts=accounts;
       	      if (accounts.length > 0) { 
            	  window.account=window.accounts[0];
            	  window.address=window.accounts[0];
            	  console.log(window.accounts);
            	  console.log(window.account);
		  hasAccount=true;
	      }
          });
	  
        }
	if (!hasAccount) {

            var user="0x" + shajs('sha224').update(eth_salt).digest('hex');    
            var bip39 = require("bip39");
            var hdkey = require('ethereumjs-wallet/hdkey');
            var ProviderEngine = require("web3-provider-engine");
            var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
            var Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
            var hdwallet = hdkey.fromMasterSeed(user); //bip39.mnemonicToSeed(mnemonic + user));
            
            // Get the first account using the standard hd path.
            var wallet_hdpath = "m/44'/60'/0'/0/";
            var wallet = hdwallet.derivePath(wallet_hdpath + "0").getWallet();
            var engine = new ProviderEngine();
            
            var address = "0x" + wallet.getAddress().toString("hex");
            var account = address;
            
            window.address=address;
            window.account=address;

            engine.addProvider(new WalletSubprovider(wallet, {}));
            engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)));
            window.web3 = new Web3(engine);
            engine.start(); // Required by the provider engine.
        }
        
        var SmartKey = contract(sk_artifacts);
        var GraphRoot = contract(db_artifacts);
        var GraphNode = contract(node_artifacts);
        var MetaData = contract(meta_artifacts);
        var CatalogueItem = contract(item_artifacts);
                
        GraphRoot.setProvider(window.web3.currentProvider);
        GraphNode.setProvider(window.web3.currentProvider);
        MetaData.setProvider(window.web3.currentProvider);
        SmartKey.setProvider(window.web3.currentProvider);
        CatalogueItem.setProvider(window.web3.currentProvider);
      
        window.getSmartKey = function(price) {
          SmartKey.deployed().then(function(contractInstance) {
          
            contractInstance.getSmartKey({value: web3.toWei(price, 'ether'), from: window.account}).then(function(v) {
            
                web3.eth.getBalance(contractInstance.address, function(error, result) {
                
                    console.log(result);
                
              });
            })
          });
        }
        
        window.balance = function() {
          return SmartKey.deployed().then(function(smartKey) {
                
                    console.log('balance ' + window.account);
                    smartKey.balanceOf.call(window.account, {from: window.account}).then(function(v) {
                        console.log(v);                    
                        return v;
                    });
            
          }); 
        }
        
        window.selectMetaData = function(node) {
                
                    return node.selectMetaData.call({from: window.account}).then(function(metaAddresses) {
                        console.log(metaAddresses);                    
                        
                        var promises=[]
                        for (var i in metaAddresses) {
                            var metaAddress=metaAddresses[i];
                            if (metaAddress) {
                                console.log(metaAddress);                    
                                promises.push(window.getMetaData(MetaData, metaAddress).then(function(meta) {
                                    return meta;
                                }));
                            }
                        }
                        return Promise.all(promises).then(function(metaJson) {
                              console.log(metaJson);
                              return metaJson;
                        });
                    });
            
        }

        window.getMetaData = function(metaInstance, address) {
                  return metaInstance.at(address).then(function(meta) {
                        return meta.rel.call({from: window.account}).then(function(rel) {
                                return meta.val.call({from: window.account}).then(function(val) {
                                    console.log({'rel':rel,'val':val});                    
                                    return {'rel':rel,'val':val};                    
                                });
                        });
                    
                  }); 
        }


        window.selectItems = function(catalogue) {
                
                return catalogue.selectItems.call({from: window.account}).then(function(itemAddresses) {
                        console.log(itemAddresses);                    
                        
                        var promises=[];
                        for (var i in itemAddresses) {
                            var itemAddress=itemAddresses[i];
                            if (itemAddress) {
                                console.log(itemAddress);                    
                                promises.push(window.getItem(CatalogueItem, itemAddress).then(function(item) {
                                    return item;
                                }));
                            }
                        }
                        return Promise.all(promises).then(function(itemJson) {
                              console.log(itemJson);
                              return itemJson;
                        });
                    });
            
        }

        window.getItem = function(itemInstance, address) {
                  return itemInstance.at(address).then(function(item) {                            
                        return item.href.call({from: window.account}).then(function(href) {
                                return self.selectMetaData(item).then(function(metaJson) {
                                    return {'href': "<a href='" + href + "'>" + href + "</a>",
                                            'item-metadata':metaJson}
                                });
                        });
                    
                  }); 
        }
    
        window.getNode = function(node, href) {
                return node.getGraphNode.call(href, {'from':window.account}).then(function(address) {
                    return GraphNode.at(address).then(function(node) {
                        return window.getCatalogue(node).then(function(pas212Root) {     
                            return pas212Root;                                                
                        });
                    });
                });
        }
    
        window.getCatalogue = function(node) {
                return self.selectMetaData(node).then(function(metaJson) {
                    return self.selectItems(node).then(function(itemJson) {    
                        var pas212Root={"catalogue-metadata":metaJson,"items":itemJson}
                        console.log(pas212Root);
                        return pas212Root;
                    });
                });
        }
        
        self.balance();
        //var href=window.location.href;
        var href=window.location.pathname;
        href=href.replace(/\/$/, "");
        console.log(window.location); 
        console.log(href)
	if (!href.match(/cat/)) {
		return;
	}

        if (href == "/cat") {        
            GraphRoot.deployed().then(function(node) {
                window.getCatalogue(node).then(function(pas212Root) {                                        
                        var hyperJson=JSON.stringify(pas212Root, null, 4);
                        jQuery("body").append("<pre><code>" + hyperJson + "</code></pre>");
                });

            });
        } else {
            href="https://iotblock.io" + href;
            console.log(href);
            GraphRoot.deployed().then(function(node) {
                window.getNode(node, href).then(function(pas212Root) {
                        var hyperJson=JSON.stringify(pas212Root, null, 4);
                        jQuery("body").append("<pre><code>" + hyperJson + "</code></pre>");
              
                });
            });            
        }
    }
}

function getUserIP(onNewIP) { 
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
        iceServers: []
    }),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

    pc.createDataChannel("");

    pc.createOffer().then(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });
        
        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function(reason) {
        // An error occurred, so handle the failure to connect
    });

    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}

function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

getUserIP(function(ip)
{
    var eth_salt=ip;
    init_wallet(eth_salt);
});
