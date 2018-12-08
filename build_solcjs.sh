#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

cd contracts
../node_modules/.bin/solcjs *.sol */*.sol */*/*.sol --abi --bin --overwrite -o ../bin/
cd ..
 
