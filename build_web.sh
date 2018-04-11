#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

sh build.sh
#npm run build
#sh babel.sh
sh build_app.sh
python testnet/test_hypercat.py
python testnet/test_pool.py
cp -pR build/app.js server/browser-tools/htdocs/js
cp -pR build/contracts server/browser-tools/htdocs/js/

