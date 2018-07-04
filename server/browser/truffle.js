module.exports = {
  build_directory: "src/solc",
  contracts_build_directory: "src/solc/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "5",
    }
  }
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
};
