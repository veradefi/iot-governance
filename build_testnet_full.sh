#!/bin/bash
PATH=./node_modules/.bin:$PATH
export PATH

ganache-cli -p 9545 -i 4447 -e 1000 &
/bin/bash build_testnet.sh bg
/bin/bash build_testnet_data.sh
npm start

