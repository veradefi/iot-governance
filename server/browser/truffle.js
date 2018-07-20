module.exports = {
  build_directory: "src/solc",
  contracts_build_directory: "src/solc/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "4447",
    },
    rinkeby: {
      host: "35.165.47.77",
      port: 8666,
      network_id: '*' // Match any network id
    }
  }
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
};
