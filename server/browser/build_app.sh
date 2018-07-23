#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

npm run build
#cp -pR build/app.js server/browser-tools/htdocs/js
#cp -pR build/contracts server/browser-tools/htdocs/js/
#cp -pR src/solc/contracts/* build/js/contracts/ 


