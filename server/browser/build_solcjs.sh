#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

cd contracts
solcjs *.sol */*.sol */*/*.sol --abi --bin --overwrite -o ../bin/
cd ..
cp -pR build/contracts/* src/solc/contracts
 