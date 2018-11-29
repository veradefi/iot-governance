eosio-cpp -I include -o iotblock.wasm src/iotblock.cpp --abigen
cleos set contract iotblock /windata/eos/contracts/iotblock --abi iotblock.abi -p iotblock@active
cleos push action iotblock create '[ "iotblock", "10000000 IOTB"]' -p iotblock@active
