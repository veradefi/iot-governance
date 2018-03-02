#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

sh build.sh
npm run build
sh babel.sh
python test_graph.py
