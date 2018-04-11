#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

truffle compile
truffle migrate --reset --network rinkeby
sh build_solcjs.sh

