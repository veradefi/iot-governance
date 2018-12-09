#!/bin/bash
echo $1
PATH=./node_modules/.bin:$PATH
export PATH
killall -9 node
killall -9 python3
npm install yarn
chmod +x node_modules/.bin/yarn
node_modules/.bin/yarn
tar -xvf web3providerfix_local.tar
chmod +x node_modules/.bin/ganache-cli
./node_modules/.bin/ganache-cli -p 9545 -i 4447 -e 1000 &

rm -fr bin/*
rm -fr build/*
rm -fr src/solc/contracts/*
chmod +x node_modules/.bin/truffle
./node_modules/.bin/truffle compile
./node_modules/.bin/truffle migrate --reset --network development

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
