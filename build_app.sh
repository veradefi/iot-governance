#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

npm run-script build
cp -pR src/solc/contracts build/js/
#cp -pR build/app.js server/browser-tools/htdocs/js
#cp -pR build/contracts server/browser-tools/htdocs/js/


