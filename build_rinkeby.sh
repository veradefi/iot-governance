#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

truffle compile
truffle migrate --reset --network rinkeby
sh build_solcjs.sh

sh build_app.sh
python rinkeby/test_hypercat.py
python rinkeby/test_pool.py
cp -pR build/app.js server/browser-tools/htdocs/js
cp -pR build/contracts server/browser-tools/htdocs/js/


