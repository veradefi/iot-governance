// request
if (typeof eth_salt == 'undefined') {
  require("babel-polyfill");
  console.log("Babel Polyfill included");
  window.hasPolyfill=true;
}

//var request = require('ajax-request');
//var jQuery = require('jquery');
// Import libraries we need.

import { default as Web3 } from 'web3';
Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
var contract = require("truffle-contract");
var BigNumber = require('bignumber.js');

import sk_artifacts from '../../build/contracts/SmartKey.json'
import key_artifacts from '../../build/contracts/Key.json'
import db_artifacts from '../../build/contracts/GraphRoot.json'
import node_artifacts from '../../build/contracts/GraphNode.json'
import meta_artifacts from '../../build/contracts/MetaData.json'
import item_artifacts from '../../build/contracts/CatalogueItem.json'
import pool_artifacts from '../../build/contracts/SmartPoolKey.json'
import poolkey_artifacts from '../../build/contracts/PoolKey.json'
import smart_node_artifacts from '../../build/contracts/SmartNode.json'

//var providerUrl = "https://iotblock.io/rpc";
var providerUrl = "http://localhost:8545";
var host=providerUrl;
    
var shajs = require('sha.js')

window.create_wallet = function(eth_salt, call_back) {        

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
        
        console.log(window.address);
    	   call_back(window.address);
}

window.init_wallet = function(eth_salt, call_back) 
{
    if (typeof eth_salt !== 'undefined') {
        
        var hasAccount=false;
     
        if (typeof web3 !== 'undefined') {
              Web3.web3Provider = web3.currentProvider;
              web3 = new Web3(web3.currentProvider);
              window.web3=web3;
              
              web3.eth.getAccounts().then(function(accounts) {
               	if (typeof accounts !== 'undefined' && accounts.length > 0) { 
                      	  window.accounts=accounts;
                    	  window.account=window.accounts[0];
                    	  window.address=window.accounts[0];
                    	  console.log(window.accounts);
                    	  console.log(window.account);
                    	  hasAccount=true;
                    	  //console.log(window.address);
                    	  call_back(window.address);
            	  	} else {
                	  	  create_wallet(eth_salt, call_back); 
            	  	}
        	     });
	  
        } else {
            create_wallet(eth_salt, call_back);
        }    
    }
}

window.get_graph = function(url, path) 
{

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
        
        window.balance = function() {
          return SmartKey.deployed().then(function(smartKey) {
                
                    console.log('balance ' + window.account);
                    return smartKey.balanceOf.call(window.account, {from: window.account}).then(function(v) {
                        
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
        
        
        if (path == "/cat") 
        {        
            return GraphRoot.deployed().then(function(node) {
            
                return window.getCatalogue(node).then(function(pas212Root) {                                        
                        return pas212Root;
                });

            });
        } else {
            //href="https://iotblock.io" + href;
            var href=url;
            console.log(href);
            return GraphRoot.deployed().then(function(node) {
                return window.getNode(node, href).then(function(pas212Root) {
                        return pas212Root
                });
            });            
        }
}



window.add_smartkey = function(beneficiary, auth, auth_key, callback) 
{
      
       var SmartKey = contract(sk_artifacts);                
       SmartKey.setProvider(window.web3.currentProvider);
         
       var Key = contract(key_artifacts);                
       Key.setProvider(window.web3.currentProvider);
       return SmartKey.deployed().then(function(contractInstance) {
        
                var eth1=1000000000000000000;
                return contractInstance.addSmartKey(beneficiary, {from: window.address, value: eth1}).then(function(address) {
                    return contractInstance.getSmartKey.call(beneficiary, {from: window.address}).then(function(keyAddress) {
                         return Key.at(keyAddress).then(function(keyInstance) {
                             return keyInstance.addKeyAuth(auth, auth_key, {from: window.address}).then(function(res) {
                             
                                    console.log('Key Address', keyAddress);
                                    callback(keyAddress);
                                    
                             });
                         });
                            
                    });                
                });
                
       });

        
}

window.add_keyAuth = function(beneficiary, auth, auth_key, callback) 
{
      
       var SmartKey = contract(sk_artifacts);                
       SmartKey.setProvider(window.web3.currentProvider);
         
       var Key = contract(key_artifacts);                
       Key.setProvider(window.web3.currentProvider);
       return SmartKey.deployed().then(function(contractInstance) {
        
                var eth1=1000000000000000000;
                return contractInstance.getSmartKey.call(beneficiary, {from: window.address}).then(function(keyAddress) {
                
                     return Key.at(keyAddress).then(function(keyInstance) {
                         return keyInstance.addKeyAuth(auth, auth_key, {from: window.address}).then(function(res) {
                         
                                console.log('Key Address', keyAddress);
                                callback(keyAddress);
                                
                         });
                     });
                        
                });                
                
       });

        
}
window.get_smartkey = function(callback) 
{
      
      
       var SmartKey = contract(sk_artifacts);                
       SmartKey.setProvider(window.web3.currentProvider);
       var Key = contract(key_artifacts);                
       Key.setProvider(window.web3.currentProvider);
        
       return SmartKey.deployed().then(function(smartKeyInstance) {
       
           return smartKeyInstance.getSmartKey.call(window.address, {from: window.address}).then(function (keyAddress) {
               console.log('Key Address',keyAddress);
           
                   
               if (keyAddress == '0x0000000000000000000000000000000000000000' || keyAddress.startsWith('0x0')) {
                       return callback(window.address,
                             keyAddress,
                             parseInt(0), 
                             parseInt(0), 
                             '0x0000000000000000000000000000000000000000', 
                             parseInt(0),
                             parseInt(0));
   
               } 
               return Key.at(keyAddress).then(function(keyInstance) {
                    return smartKeyInstance.balanceOf.call(keyAddress, {from: window.address}).then(function(token_balance) {
                        return keyInstance.vault.call({from: window.address}).then(function(vault) {
                            return keyInstance.state.call({from: window.address}).then(function(state) {
                                return keyInstance.health.call({from: window.address}).then(function(health) {
    
                                   var eth1=1000000000000000000;
                                   
                                   var eth_amount=web3.eth.getBalance(keyAddress);
                                   callback(window.address,
                                             keyAddress,
                                             parseInt(token_balance.toString()), 
                                             parseInt(eth_amount.toString()), 
                                             vault, 
                                             parseInt(state.toString()),
                                             parseInt(health.toString()))
                                   console.log(eth_amount);
                                });                       
    
                            });                       
                        });
                    });
               });                                                     
            });
        });

}


window.get_graphnode_smartkey = function(href, callback) 
{
      
        var GraphRoot = contract(db_artifacts);
        var Key = contract(key_artifacts);                
        var GraphNode = contract(node_artifacts);
        var SmartKey = contract(sk_artifacts);                
                
        GraphRoot.setProvider(window.web3.currentProvider);
        GraphNode.setProvider(window.web3.currentProvider);        
        SmartKey.setProvider(window.web3.currentProvider);
        Key.setProvider(window.web3.currentProvider);
        

        return GraphRoot.deployed().then(function(node) 
        {
            return node.getGraphNode.call(href, {'from':window.account}).then(function(keyAddress) 
            {  
                   return Key.at(keyAddress).then(function(keyInstance) 
                   {
                        return keyInstance.activated.call(window.address, {from: window.address}).then(function(amount) 
                        {
                            return keyInstance.vault.call({from: window.address}).then(function(vault) 
                            {
                                return keyInstance.state.call({from: window.address}).then(function(state) 
                                {
                                    return keyInstance.health.call({from: window.address}).then(function(health) 
                                    {
            
                                           var eth1=1000000000000000000;
                                           //amount /= eth1;
                                           
                                           callback(keyAddress,
                                                     parseInt(amount.toString()), 
                                                     vault, 
                                                     parseInt(state.toString()),
                                                     parseInt(health.toString()))
                                           console.log(amount);
            
                                    });                       
                                });
                            });
                       });                                                     
                 });
            });
        });

}

window.add_node = function(parent_address, _href, callback) 
{

       var GraphRoot = contract(db_artifacts);
       var SmartNode = contract(smart_node_artifacts);
                      
       SmartNode.setProvider(window.web3.currentProvider);        
       GraphRoot.setProvider(window.web3.currentProvider);        
      
       return GraphRoot.deployed().then(function(graphRoot) {
            if (!parent_address) {
                parent_address=graphRoot.address;
                alert(parent_address);
            }
            
            return SmartNode.deployed().then(function(contractInstance) {

                return contractInstance.upsertNode(parent_address, _href, {from: window.address}).then(function(res) {
                                
                        return graphRoot.getGraphNode.call(_href, {from: window.address}).then(function(node_address) {
                                                              
                            console.log(node_address);
                            return callback(node_address);
                            
                        });                            
                });                
            });
       });

        
}




window.add_pool = function(beneficiary, max_contrib, max_per_contrib, min_per_contrib, admins, has_whitelist, fee, callback) 
{


       max_contrib= new BigNumber(max_contrib);
       max_per_contrib= new BigNumber(max_per_contrib);
       min_per_contrib= new BigNumber(min_per_contrib);
      
       var SmartPoolKey = contract(pool_artifacts);                
       SmartPoolKey.setProvider(window.web3.currentProvider);
 
        if (fee == 'Infinity' || fee < 1) 
            fee=1;
            
        console.log(beneficiary + ' , ' + max_contrib + ' , ' + max_per_contrib + ' , ' + min_per_contrib + ' , ' + admins + ' , ' + has_whitelist + ' , ' + fee);
        
      
        return SmartPoolKey.deployed().then(function(contractInstance) {
             
                return contractInstance.addSmartPoolKey(beneficiary, max_contrib, max_per_contrib, min_per_contrib, admins, has_whitelist, fee, {from: window.address}).then(function(address) {
                    
                    return contractInstance.getSmartPoolKey.call(beneficiary, {from: window.address}).then(function(address) {
                          
                            console.log(address);
                            callback(address);
                            
                    });
                
                });
         });

        
}




window.get_pool = function(poolkey, callback) 
{
    if (poolkey != '0x0') {
        var PoolKey = contract(poolkey_artifacts);                
        PoolKey.setProvider(window.web3.currentProvider);       
        return PoolKey.at(poolkey).then(function(contractInstance) {             
            return contractInstance.isMember.call(window.address).then(function(eth_sent) {
                 return contractInstance.contrib_amount.call().then(function(contrib_total) {
                    return contractInstance.max_contrib.call().then(function(max_contrib) {
                        return contractInstance.max_per_contrib.call().then(function(max_per_contrib) {
                            return contractInstance.min_per_contrib.call().then(function(min_per_contrib) {
                                return contractInstance.fee.call().then(function(fee) {
                                    return contractInstance.received.call(window.address).then(function(received) {
                                           console.log('got member info');
                                           var eth1=1000000000000000000;
                                           eth_sent /= eth1;
                                           contrib_total /= eth1;
                                           max_contrib /= eth1
                                           max_per_contrib /= eth1;
                                           min_per_contrib /= eth1;
                                           received /= eth1;
                                           callback(poolkey,
                                                     parseInt(eth_sent.toString()), 
                                                     parseInt(contrib_total.toString()), 
                                                     parseInt(max_contrib.toString()), 
                                                     parseInt(max_per_contrib.toString()), 
                                                     parseInt(min_per_contrib.toString()), 
                                                     1/parseFloat(fee.toString()) * 100,
                                                     parseInt(received));
                                    });                
                                });                
                            });                
                        });
                    });
                });            
            });
         });
    }        
}




window.get_pool_transactions = function(poolkey, callback) 
{
    if (poolkey != '0x0') {
       var PoolKey = contract(poolkey_artifacts);                
       PoolKey.setProvider(window.web3.currentProvider);
       
        return PoolKey.at(poolkey).then(function(contractInstance) {
            window.get_one_transaction=function(contractInstance, idx) {
                contractInstance.transactions.call(window.address, idx).then(function(v) {
                    var sender=v[0];
                    var date=v[1];
                    var amount=v[2];
                    if (sender.toString() != '0x0' || date != 0) {
                        callback(sender, date.toString(), amount.toString());                        
                        get_one_transaction(contractInstance, idx+1);
                    } else {
                        return;
                    }
                    
                }).catch(function(error) {
                  console.log('End of History');
                });
                
            }
            get_one_transaction(contractInstance, 0);
        });

    }        
}

window.send_ether = function(pooladdress, amount)
{
    if (pooladdress != '0x0') {
        window.web3.eth.sendTransaction({ 'from' :window.address, 'to':pooladdress, 'value':amount});
    }
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

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}



if (typeof isSmartKey !== 'undefined') {

    var eth_salt = getCookie('iotcookie');
    if (eth_salt == null) {
        setCookie('iotcookie',new Date().toUTCString(),7);
        eth_salt = getCookie('iotcookie');
    }
    
    
    var check_key=function(address) {
        console.log('address' + address);
        $('.address').html(address);
        $('.address_val').val(address);
        page2(address);
    }
    init_wallet(eth_salt, check_key);
    
}


if (typeof isBrowse !== 'undefined') {

    var eth_salt = getCookie('iotcookie');
    if (eth_salt == null) {
        setCookie('iotcookie',new Date().toUTCString(),7);
        eth_salt = getCookie('iotcookie');
    }
    
    
    var check_key=function(address) {
        var url='https://iotblock.io/cat';
        var path='/cat';
        url=url.replace(/\/$/, "");
        url=url.replace(/icat/, "cat");
        url="https://iotblock.io" + path
        path=path.replace(/\/$/, "");
        path=path.replace(/icat/, "cat");
        
        console.log(url); 
        console.log(path)
        
        console.log('address' + address);
        $('.address').html(address);
        $('.address_val').val(address);
    }
    init_wallet(eth_salt, check_key);

}

if (typeof isWeb !== 'undefined') {

    var eth_salt = getCookie('iotcookie');
    if (eth_salt == null) {
        setCookie('iotcookie',new Date().toUTCString(),7);
        eth_salt = getCookie('iotcookie');
    }
    
    var callback=function(address) {
        
        var url=window.location;
        var path=window.location.pathname;
        url=url.replace(/\/$/, "");
        url=url.replace(/icat/, "cat");
        path=path.replace(/\/$/, "");
        path=path.replace(/icat/, "cat");
        
        console.log(url); 
        console.log(path)
        
        get_graph( url, path).then(function(pas212Root) {
            var hyperJson=JSON.stringify(pas212Root, null, 4);
            document.documentElement.innerHTML = "<pre><code>" + hyperJson + "</code></pre>";
        });                        
    }
    
    init_wallet(eth_salt, callback);
    
}

if (typeof isPool !== 'undefined') {

    var eth_salt = getCookie('iotcookie');
    if (eth_salt == null) {
        setCookie('iotcookie',new Date().toUTCString(),7);
        eth_salt = getCookie('iotcookie');
    }
    
    var callback=function(address) {
        console.log('address' + address);
        $('.address').html(address);
        $('.address_val').val(address);
        
    }
    
    init_wallet(eth_salt, callback);
}

