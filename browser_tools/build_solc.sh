#!/bin/sh
PATH=./node_modules/.bin:$PATH
export PATH

solc contracts/PublicOffering.sol --abi --bin --overwrite -o bin/
solc contracts/SmartKey.sol --abi --bin --overwrite -o bin/
solc contracts/GraphNode.sol --abi --bin --overwrite -o bin/
solc contracts/GraphRoot.sol --abi --bin --overwrite -o bin/
solc contracts/Catalogue.sol --abi --bin --overwrite -o bin/
solc contracts/MetaData.sol --abi --bin --overwrite -o bin/
solc contracts/Catalogue.sol --abi --bin --overwrite -o bin/
solc contracts/NodeMetaData.sol --abi --bin --overwrite -o bin/
solc contracts/SmartNode.sol --abi --bin --overwrite -o bin/
solc contracts/SmartPoolKey.sol --abi --bin --overwrite -o bin/
