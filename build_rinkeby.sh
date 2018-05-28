#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

rm -fr bin/*
rm -fr build/*
truffle compile
truffle migrate --reset --network rinkeby
sh build_solcjs.sh

sleep 200

sh build_rinkeby_data.sh


