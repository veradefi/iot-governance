#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

rm -fr bin/*
rm -fr build/*
truffle compile
truffle migrate --reset --network testrpc
sh build_solcjs.sh

