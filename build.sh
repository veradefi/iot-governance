rm -fr bin/*
rm -fr build/*
truffle compile
truffle migrate --reset --network testrpc
solc contracts/PublicOffering.sol --abi --bin --overwrite -o bin/
solc contracts/SmartKey.sol --abi --bin --overwrite -o bin/
solc contracts/Database.sol --abi --bin --overwrite -o bin/
npm run build
