#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

cd contracts
solcjs *.sol */*.sol */*/*.sol --abi --bin --overwrite -o ../bin/
cd ..
 
