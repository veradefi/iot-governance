#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

python3 testnet/restore_hypercat.py
python3 testnet/test_smartkey.py

#python3 testnet/test_restore_hypercat.py
#cp -pR build/contracts server/browser-tools/htdocs/js/

npm start
