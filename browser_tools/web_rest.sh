#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

python server/index.py
