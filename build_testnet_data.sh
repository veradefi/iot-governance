#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

python3 testnet/test_restore_hypercat.py
#cp -pR build/contracts server/browser-tools/htdocs/js/


