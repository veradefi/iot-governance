import SmartPoolKey from './solc/contracts/SmartPoolKey.json'
import GraphNode from './solc/contracts/GraphNode.json'
import MetaData from './solc/contracts/MetaData.json'
import GraphRoot from './solc/contracts/GraphRoot.json'
import SmartNode from './solc/contracts/SmartNode.json'
import PoolKey from './solc/contracts/PoolKey.json'

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      //url: 'ws://127.0.0.1:8545'
      url: 'https://rinkeby.infura.io/8BNRVVlo2wy7YaOLcKCR'
    }
  },
  contracts: [
    SmartPoolKey,
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
      blocks: 1500
  },
  //syncAlways,
}

export default drizzleOptions