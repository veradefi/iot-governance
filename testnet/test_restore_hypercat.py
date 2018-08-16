# -*- coding: utf-8 -*-
import json
from web3 import Web3, HTTPProvider, IPCProvider, contract
import sha3
import random
import sys
import json
import codecs
import re
import os
import base64
from iotblock_sdk.pathfinder import Catalogue
import iotblock_sdk.hypercat as hypercat
import json
import logging


def getApiKey(kc, address2, eth_contrib):
    authKey=kc.call({'from':address2}).getKeyAuth(str(address2).lower())

    print ('authKey',authKey.lower())
    api_key=authKey;
    api_auth=address2;
    data="Token api_key=\"%s\" auth=\"%s\" eth_contrib=\"%s\"" % (api_key, api_auth, eth_contrib);
    print(data)
    data = base64.b64encode(data.encode('utf-8'))
    data = base64.b64encode(data + ':'.encode('utf-8'));
    print ('apikey',data);
    return data;
    #xhr.setRequestHeader("Accept","application/vvv.website+json;version=1");
    #xhr.setRequestHeader("Authorization", data); 

def addAuthKey(kc, address2):
    k = sha3.keccak_256()
    k.update(str(random.random()).encode('utf-8'))
    username=k.hexdigest()
    k = sha3.keccak_256()
    k.update(str(random.random()).encode('utf-8'))
    password=k.hexdigest()
    auth_key=address2 + ":" + username + ":" + password;
    auth_key=auth_key.lower()
    k = sha3.keccak_256()
    k.update(auth_key.encode('utf-8'))
    auth_key=str(k.hexdigest())
    print ('addAuthKey', kc.transact({ 'from': address2, 'gas': 4000000, 'gasPrice':1000000000}).addKeyAuth(str(address2).lower(), auth_key))


def getContract(item, network, address=None, prefix=""):
    abi = json.loads(open('bin/' + prefix +  item + '_sol_' + item + '.abi').read())
    bin = open('bin/' + prefix + item + '_sol_' +  item + '.bin').read()
    json_data=open('src/solc/contracts/' + item + '.json').read()
    data = json.loads(json_data)
    
    if address is None:
        address=data['networks'][network]['address']
    conf_c = web3.eth.contract(abi=abi, bytecode=bin)
    conf=conf_c(web3.toChecksumAddress(address))
    return conf

network='4447'
port='9545'
TEST_PATHFINDER_URL_ROOT = "http://127.0.0.1:8888/cat"
API_KEY=""
web3Provider='http://127.0.0.1:' + port


web3 = Web3(HTTPProvider(web3Provider))
address=web3.toChecksumAddress(web3.eth.coinbase)
address2=web3.toChecksumAddress(web3.eth.accounts[0])
gc=getContract('SmartKey',network)
io=getContract('PublicOffering',network)
eth1=1000000000000000000;
eth_contrib=int(eth1/100000);
key=gc.call({ 'from': address2 }).getSmartKey(address2)
kc=getContract('Key',network, key, prefix="pki_")
addAuthKey(kc, address2)
API_KEY=str(getApiKey(kc, address2, eth_contrib))[1:-1]





def unittest():
    
    
    print("Running tests")
    logging.getLogger().setLevel(logging.DEBUG)

    print("Create a catalogue on Pathfinder")
    p = Catalogue(TEST_PATHFINDER_URL_ROOT, API_KEY)
    h1 = hypercat.Hypercat("Dummy test catalogue")
    print(h1);
    with open('backups/1.json') as json_data:
        data = json.load(json_data)
    #p.backup('backups/1.json');
    
    h1 = hypercat.loads(json.dumps(data))
    print(json.dumps(h1.asJSON(), indent=4))
    p.create(h1)
    print("Read it")
    h2 = hypercat.loads(json.dumps(p.get()))

    print("Did we get back what we wrote?")
    print("h1:")
    print(h1.asJSON())
    print("h2:")
    print(h2.asJSON())
    assert(h1.asJSON() == h2.asJSON())

    print("All tests passed")
    
if __name__ == '__main__':
    # Unit tests
    unittest()
