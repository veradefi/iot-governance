#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

#rm -fr bin/*
#rm -fr build/*
truffle compile
truffle migrate --reset --network rinkeby
cp -pR build/contracts/* src/solc/contracts/
sh build_solcjs.sh

sleep 200

sh build_rinkeby_data.sh


