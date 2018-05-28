#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

npm run build
babel build/app.js > build/app2.js
cp build/app2.js build/app.js
