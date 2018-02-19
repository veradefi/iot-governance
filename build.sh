rm -fr build/*
truffle compile
truffle migrate --reset --network testrpc
rm -fr bin/*
solc contracts/PublicOffering.sol --abi --bin --overwrite -o bin/
solc contracts/SmartKey.sol --abi --bin --overwrite -o bin/
solc contracts/Database.sol --abi --bin --overwrite -o bin/
npm run build
