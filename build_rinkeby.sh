#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

killall -9 node
killall -9 python3
rm -fr bin/*
rm -fr build/*
rm -fr src/solc/contracts/*
yarn
tar -xvf web3providerfix_rinkeby.tar
truffle compile
truffle migrate --reset --network rinkeby_local
cp -pR build/contracts/* src/solc/contracts/
bash build_solcjs.sh
tar -cf bin5.tar bin build/contracts src/solc/contracts

#sleep 200
#sh build_rinkeby_data.sh


