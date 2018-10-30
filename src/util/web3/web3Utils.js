import { default as Web3 } from 'web3';
import sk_artifacts from '../../solc/contracts/SmartKey.json'
import key_artifacts from '../../solc/contracts/Key.json'
import db_artifacts from '../../solc/contracts/GraphRoot.json'
import node_artifacts from '../../solc/contracts/GraphNode.json'
import meta_artifacts from '../../solc/contracts/MetaData.json'
import item_artifacts from '../../solc/contracts/Catalogue.json'
import pool_artifacts from '../../solc/contracts/SmartPoolKey.json'
import poolkey_artifacts from '../../solc/contracts/PoolKey.json'
import smart_node_artifacts from '../../solc/contracts/SmartNode.json'
import contract from 'truffle-contract';
import BigNumber from 'bignumber.js';
import createKeccak from 'keccak';
import shajs from 'sha.js'

Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;

   
  
  
  //var providerUrl = "https://iotblock.io/rpc";
  //var providerUrl = "http://localhost:9545";
  var providerUrl = "https://rinkeby.infura.io/8BNRVVlo2wy7YaOLcKCR";
  var host=providerUrl;
      
  
export const create_wallet = (eth_salt, call_back) => {        
  
          var salt=eth_salt;
          if (window.eth_salt) {
              alert(window.eth_salt);
              salt=window.eth_salt;
          }
          if (global.eth_salt) {
            alert(global.eth_salt);
            salt=global.eth_salt;
          }

          if (!window.address) {
            var user="0x" + shajs('sha224').update(salt).digest('hex');    
            var bip39 = require("bip39");
            var hdkey = require('ethereumjs-wallet/hdkey');
            var ProviderEngine = require("web3-provider-engine");
            var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
            //var Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
            var RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js')
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
            engine.addProvider(new RpcSubprovider({
                rpcUrl: providerUrl,
            }))
        
            window.web3 = new Web3(engine);
            engine.start(); // Required by the provider engine.
          }
          console.log(window.address);
             call_back(window.address);
  }
  
export const init_wallet = (eth_salt, call_back)  =>
  {
      var salt=eth_salt;
      if (window.eth_salt) {
        salt=window.eth_salt;
      }

      if (typeof salt !== 'undefined') {
          var web3 = window.web3;  
          var hasAccount=false;
       
          if (typeof web3 !== 'undefined') {

                if (window.address) {
                    return call_back(window.address);
                }
                var web3 = window.web3

                Web3.web3Provider = web3.currentProvider;
                web3 = new Web3(web3.currentProvider);
                window.web3=web3;
                if (web3.eth.getAccounts()) {
                    web3.eth.getAccounts().then(function(accounts) {
                        console.log(accounts);
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
                                create_wallet(salt, call_back); 
                            }
                    });
                } else {
                    create_wallet(salt, call_back); 

                }
        
          } else {
              create_wallet(salt, call_back);
          }    
      }
  }
  
export const get_graph = (url, path) =>
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
                                  return window.selectMetaData(item).then(function(metaJson) {
                                      return {'href': "<a href='" + href + "'>" + href + "</a>",
                                              'item-metadata':metaJson}
                                  });
                          });
                      
                    }); 
          }
      
          window.getNode = function(node, href) {
                  return node.getItem.call(href, {'from':window.account}).then(function(address) {
                      return GraphNode.at(address).then(function(node) {
                          return window.getCatalogue(node).then(function(pas212Root) {     
                              return pas212Root;                                                
                          });
                      });
                  });
          }
      
          window.getCatalogue = function(node) {
                  return window.selectMetaData(node).then(function(metaJson) {
                      return window .selectItems(node).then(function(itemJson) {    
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
  
  
  
  
  export const add_smartkey = (beneficiary, cb)  => 
  {       
         var SmartKey = contract(sk_artifacts);                
         SmartKey.setProvider(window.web3.currentProvider);
           
         var Key = contract(key_artifacts);                
         Key.setProvider(window.web3.currentProvider);
         return SmartKey.deployed().then(function(contractInstance) {
          
                  var eth1=1000000000000000000;
                  return contractInstance.getSmartKey.call(beneficiary.toLowerCase(), {from: window.address}).then(function(keyAddress) {
                      if (keyAddress != '0x0000000000000000000000000000000000000000') {
                          //alert(keyAddress);
                          console.log('Key Address', keyAddress.toLowerCase());
                          cb(keyAddress.toLowerCase());
                      } else {
                          return contractInstance.loadSmartKey(keyAddress, beneficiary.toLowerCase(), "Deposit", {from: window.address, value: eth1, gas:4000000, gasPrice:1000000000}).then(function(keyAddress) {
                              return contractInstance.getSmartKey(beneficiary.toLowerCase(), {from: window.address}).then(function(keyAddress) {
                         
                                          //alert(keyAddress.toString());
                                          cb(keyAddress.toString().toLowerCase());
                                          console.log('New Key Address', keyAddress.toString().toLowerCase());
                              });
                              
                          }).catch(function(error) {
                              console.log(error);
                              alert(error.message);
                              cb('0x0000000000000000000000000000000000000000');
                          });
                      }                            
                  });
                  
         });
  
          
  }
  
export const add_keyAuth = function(beneficiary, auth, auth_key, cb) 
  {
        
         var auth_str=auth.toLowerCase(); //createKeccak('keccak256').update(auth.toLowerCase())._resetState().digest('hex');
         var auth_key_str=createKeccak('keccak256').update(auth_key.toLowerCase())._resetState().digest('hex');
  
         var SmartKey = contract(sk_artifacts);                
         SmartKey.setProvider(window.web3.currentProvider);
           
         var Key = contract(key_artifacts);                
         Key.setProvider(window.web3.currentProvider);
         return SmartKey.deployed().then(function(contractInstance) {
          
                  var eth1=1000000000000000000;
                  return contractInstance.getSmartKey.call(beneficiary.toLowerCase(), {from: window.address}).then(function(keyAddress) {
                  
                       return Key.at(keyAddress).then(function(keyInstance) {
                           return keyInstance.addKeyAuth(auth_str.toLowerCase(), auth_key_str.toLowerCase(), {from: window.address, gas: 4000000, gasPrice:1000000000}).then(function(res) {
                           
                                  console.log('Key Address', keyAddress.toLowerCase());
                                  cb( auth, auth_key_str.toLowerCase(), keyAddress );
                                  
                           }).catch(function(error) {
                            console.log(error);
                            alert(error.message);
                            cb( auth, '', keyAddress );
                            });
                       });
                          
                  });                
                  
         });
          
  }
  
export const get_keyAuth = (beneficiary, cb) =>
  {

         //var auth_str=createKeccak('keccak256').update(beneficiary.toLowerCase())._resetState().digest('hex');
  
         var SmartKey = contract(sk_artifacts);                
         SmartKey.setProvider(window.web3.currentProvider);
           
         var Key = contract(key_artifacts);                
         Key.setProvider(window.web3.currentProvider);
         return SmartKey.deployed().then(function(contractInstance) {
                  console.log("web3Utils:get_KeyAuth")
          
                  var eth1=1000000000000000000;
                  return contractInstance.getSmartKey.call(beneficiary.toLowerCase(), {from: window.address}).then(function(keyAddress) {
                      //alert(keyAddress);
                      console.log('Key Address for Auth', keyAddress);
                      if (keyAddress != '0x0000000000000000000000000000000000000000') {
                  
                       return Key.at(keyAddress).then(function(keyInstance) {
                           return keyInstance.getKeyAuth.call(beneficiary.toLowerCase(), {from: window.address}).then(function(res) {

                                  console.log('API Key', res.toString().toLowerCase());
                                  cb(beneficiary, res.toString().toLowerCase(), keyAddress.toLowerCase());
                                  
                           });
                       });
                      } else {
                                 console.log("API Key not found");
                                 console.log(cb);
                                 cb(beneficiary, '', '');
                      }
                          
                  });                
                  
         });
  
          
  }
  
export const get_smartkey = (cb) =>
  {
        
        
         var SmartKey = contract(sk_artifacts);                
         SmartKey.setProvider(window.web3.currentProvider);
         var Key = contract(key_artifacts);                
         Key.setProvider(window.web3.currentProvider);
          
         return SmartKey.deployed().then(function(smartKeyInstance) {
         
             return smartKeyInstance.getSmartKey.call(window.address, {from: window.address}).then(function (keyAddress) {
                 console.log('Key Address',keyAddress);
             
                     
                 if (keyAddress == '0x0000000000000000000000000000000000000000') {
                         return cb(window.address,
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
                                     
                                     var web3=window.web3;
                                     var eth_amount=web3.eth.getBalance(keyAddress);
                                     cb(window.address,
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
  
  
export const get_graphnode_smartkey = (href, callback)  => 
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
              return node.getItem.call(href, {'from':window.account}).then(function(keyAddress) 
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
  
  export const add_node = (parent_address, _href) =>
  {
  
         var GraphRoot = contract(db_artifacts);
         var SmartNode = contract(smart_node_artifacts);
                        
         SmartNode.setProvider(window.web3.currentProvider);        
         GraphRoot.setProvider(window.web3.currentProvider);        
        
         return GraphRoot.deployed().then(function(graphRoot) {
              if (!parent_address) {
                  parent_address=graphRoot.address;
                  //alert(parent_address);
              }
              
              return SmartNode.deployed().then(function(contractInstance) {
  
                  return contractInstance.upsertItem(parent_address, _href, {from: window.address}).then(function(res) {
                                  
                          return graphRoot.getItem.call(_href, {from: window.address}).then(function(node_address) {
                                                                
                              alert(node_address)
                              console.log(node_address);
                              return node_address; //callback(node_address);
                              
                          });                            
                  });                
              });
         });
  
          
  }
  
  
  
  
export const add_pool = (beneficiary, max_contrib, max_per_contrib, min_per_contrib, admins, has_whitelist, fee, autoDistribute, callback) => {
  
  
         max_contrib= new BigNumber(max_contrib);
         max_per_contrib= new BigNumber(max_per_contrib);
         min_per_contrib= new BigNumber(min_per_contrib);
        
         var SmartPoolKey = contract(pool_artifacts);                
         SmartPoolKey.setProvider(window.web3.currentProvider);
   
          if (fee == 'Infinity' || fee < 1) 
              fee=1;
              
          console.log(beneficiary + ' , ' + max_contrib + ' , ' + max_per_contrib + ' , ' + min_per_contrib + ' , ' + admins + ' , ' + has_whitelist + ' , ' + fee);
          
        
          return SmartPoolKey.deployed().then(function(contractInstance) {
               
                  return contractInstance.addSmartPoolKey(beneficiary, max_contrib, max_per_contrib, min_per_contrib, admins, has_whitelist, fee, autoDistribute, {from: window.address}).then(function(address) {
                      
                      return contractInstance.getSmartPoolKey.call(beneficiary, {from: window.address}).then(function(address) {
                            
                              console.log(address);
                              callback(address);
                              
                      });
                  
                  });
           });
  
          
  }
  
  

export const get_web3 = () => {
    return window.web3;
}

export const get_pool_contract_cfg = (poolkey) => {
    console.log(poolkey_artifacts)
      var jsonInterface=poolkey_artifacts.abi.slice(0);
      console.log(jsonInterface)
      var poolkey_contract=new window.web3.eth.Contract(jsonInterface, poolkey);
      var contractConfig = {
        contractName: poolkey,
        web3Contract: poolkey_contract
      }
      return contractConfig;
}

export const get_meta_contract_cfg = (meta) => {
    console.log(meta_artifacts)
      var jsonInterface=meta_artifacts.abi.slice(0);
      console.log(jsonInterface)
      var meta_contract=new window.web3.eth.Contract(jsonInterface, meta);
      var contractConfig = {
        contractName: meta,
        web3Contract: meta_contract
      }
      return contractConfig;
}

export const get_item_contract_cfg = (item) => {
    console.log(item_artifacts)
      var jsonInterface=item_artifacts.abi.slice(0);
      console.log(jsonInterface)
      var item_contract=new window.web3.eth.Contract(jsonInterface, item);
      var contractConfig = {
        contractName: item,
        web3Contract: item_contract
      }
      return contractConfig;
}

export const get_pool = (poolkey, callback) =>
  {
      if (poolkey != '' && poolkey != '0x0') {
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
                                          var web3=window.web3;

                                          return web3.eth.getBalance(poolkey).then(function (eth_amount) {
                                              return contractInstance.autoDistribute.call().then(function(autoDistribute) {
                                                  return contractInstance.getMembers.call().then(function(members) {
      
                                                         console.log('got member info');
                                                         var eth1=1000000000000000000;
                                                         eth_amount /= eth1;
                                                         eth_sent /= eth1;
                                                         contrib_total /= eth1;
                                                         max_contrib /= eth1
                                                         max_per_contrib /= eth1;
                                                         min_per_contrib /= eth1;
                                                         received /= eth1;
                                                         callback(poolkey,
                                                                   parseFloat(eth_amount.toString()),
                                                                   parseFloat(eth_sent.toString()), 
                                                                   parseFloat(contrib_total.toString()), 
                                                                   parseInt(max_contrib.toString()), 
                                                                   parseInt(max_per_contrib.toString()), 
                                                                   parseInt(min_per_contrib.toString()), 
                                                                   1/parseFloat(fee.toString()) * 100,
                                                                   parseFloat(received),
                                                                   autoDistribute,
                                                                   members);
                                                  });
                                              });
                                          });
                                      });                
                                  });                
                              });                
                          });
                      });
                  });            
              });
           });
      } else {
          callback('0x0',0,
                                                       0, 
                                                       0, 
                                                       0, 
                                                       0, 
                                                       0, 
                                                       0,
                                                       0, true, []);
      } 
  }
  
  
  
  
export const get_pool_transactions = (poolkey, callback)  =>
  {
      if (poolkey != '0x0') {
         var PoolKey = contract(poolkey_artifacts);                
         PoolKey.setProvider(window.web3.currentProvider);
         
          return PoolKey.at(poolkey).then(function(contractInstance) {
              window.get_one_transaction=function(contractInstance, idx) {
                  contractInstance.transactions.call(window.address, idx).then(function(v) {
                      var account=v[0];
                      var date=v[1];
                      var amount=v[2];
                      var tx_type=v[3];
                      if (account.toString() != '0x' && account.toString() != '0x0' && date != 0) {
                          callback(account, date.toString(), amount.toString(), parseInt(tx_type.toString()));                        
                          window.get_one_transaction(contractInstance, idx+1);
                      } else {
                          return;
                      }
                      
                  }).catch(function(error) {
                    console.log('End of History');
                  });
                  
              }
              window.get_one_transaction(contractInstance, 0);
          });
  
      }        
  }
  
  export const send_ether = function(pooladdress, amount)
  {
      if (pooladdress != '0x0') {
          window.web3.eth.sendTransaction({ 'from' :window.address, 'to':pooladdress, 'value':amount});
      }
  }
  
  
  export const distribute_pool_ether = function(pooladdress, callback)
  {
      if (pooladdress != '0x0') {
          var PoolKey = contract(poolkey_artifacts);                
          PoolKey.setProvider(window.web3.currentProvider);       
          return PoolKey.at(pooladdress).then(function(contractInstance) {                    
              return window.web3.eth.getBalance(pooladdress).then(function (eth_amount) {            
                  return contractInstance.distributeEth(eth_amount,{from: window.address, gas:4000000, gasPrice:1000000000}).then(function(res) {
                       callback(res);
                  });
              });
          });
              
      }
      callback(false);
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
  
  export const setCookie=(name,value,days) => {
      var expires = "";
      if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days*24*60*60*1000));
          expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }
  
  export const getCookie = (name) => {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
  }
  
  
  
export const runState=function() {
      
      
      /*
      if (typeof window.isBrowse !== 'undefined' && window.isBrowse) {
      
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
              
              get_keyAuth(address, fill_api_info) 
          }
          init_wallet(eth_salt, check_key);
      
      }
      
      if (typeof isWeb !== 'undefined' && isWeb) {
      
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
      
      if (typeof isPool !== 'undefined' && isPool) {
      
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
      
      */
  }
  