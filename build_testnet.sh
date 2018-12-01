#!/bin/bash
echo $1
PATH=./node_modules/.bin:$PATH
export PATH
ganache-cli -p 9545 -i 4447 -e 1000 &

rm -fr bin/*
rm -fr build/*
rm -fr src/solc/contracts/*
truffle compile
truffle migrate --reset --network development

if ! [ -d  src/solc/contracts/ ] 
then
    mkdir -p src/solc/contracts/
fi

cp -pR build/contracts/* src/solc/contracts/

sh build_solcjs.sh
case $1 in
    bg)
        python3 server/index_testnet.py &
        ;;
    *)
        python3 server/index_testnet.py 
        ;;
esac
#python3 testnet/restore_hypercat.py
#python3 testnet/test_smartkey.py
#npm start
