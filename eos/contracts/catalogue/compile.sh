cleos create account eosio catalogue EOS76DbEXt2Yjdz3DcwdCVSkUySArUVxPc29zK9ShcMELd62w3axe EOS76DbEXt2Yjdz3DcwdCVSkUySArUVxPc29zK9ShcMELd62w3axe -p eosio@active
eosio-cpp -I include -o catalogue.wasm src/catalogue.cpp --abigen
cleos set contract catalogue /windata/eos/contracts/catalogue --abi catalogue.abi -p catalogue@active
