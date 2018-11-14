#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

ganache-cli -p 9545 -i 4447 -e 1000 &
sh build_testnet.sh &
sh build_testnet_data.sh
npm start

