#!/bin/sh
cd contracts
solcjs *.sol */*.sol */*/*.sol --abi --bin --overwrite -o ../bin/
cd ..

