#!/bin/bash
PATH=./node_modules/.bin:$PATH
export PATH

/bin/bash build_testnet.sh bg
/bin/bash build_testnet_data.sh

