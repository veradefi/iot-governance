import SmartPoolKey from './solc/contracts/SmartPoolKey.json'
import GraphNode from './solc/contracts/GraphNode.json'
import MetaData from './solc/contracts/MetaData.json'
import GraphRoot from './solc/contracts/GraphRoot.json'
import SmartNode from './solc/contracts/SmartNode.json'
import SmartKey from './solc/contracts/SmartKey.json'
import PoolKey from './solc/contracts/PoolKey.json'
import * as web3Utils from './util/web3/web3Utils.js'

var drizzleOptions = {
  web3: {
    //block: false,
    fallback: {
      type: 'ws',
      url: 'wss://rinkeby.infura.io/ws'
      //url: 'ws://127.0.0.1:8545'
      //url: 'https://rinkeby.infura.io/8BNRVVlo2wy7YaOLcKCR'
    }
  },
  contracts: [
    SmartPoolKey,
    SmartKey,
    //GraphNode,
    //MetaData,
    GraphRoot,
    SmartNode
    //PoolKey
  ],
  //events: {
  //  SimpleStorage: ['StorageSet']
  //},
  polls: {
      accounts: 1500,
      //blocks: 1500
  },
  //syncAlways,
}


var getKeyStatus = () => {
  var self=this;
    
  var eth_salt = web3Utils.getCookie('iotcookie');
  if (window.eth_salt) {
      eth_salt=window.eth_salt;
  }
  if (eth_salt == null) {
      web3Utils.setCookie('iotcookie',new Date().toUTCString(),7);
      eth_salt = web3Utils.getCookie('iotcookie');
  }
  
  
  var check_key=function(address) {
      console.log('address' + address);
      drizzleOptions.web3=web3Utils.get_web3();
      
  }

  web3Utils.init_wallet(eth_salt, check_key);
  
}

getKeyStatus();

export default drizzleOptions