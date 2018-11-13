#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH
ganache-cli -p 9545 -i 4447 -e 1000 &

#rm -fr bin/*
#rm -fr build/*
truffle compile
truffle migrate --reset --network development
cp -pR build/contracts/* src/solc/contracts/
sh build_solcjs.sh
python3 server/index_testnet.py &
python3 testnet/restore_hypercat.py
python3 testnet/test_smartkey.py
npm start
