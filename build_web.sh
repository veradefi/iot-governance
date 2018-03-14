#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

sh build.sh
npm run build
#sh babel.sh
python test_hypercat.py
cp -pR build/app.js server/browser-tools/htdocs/js
cp -pR build/contracts server/browser-tools/htdocs/js/

