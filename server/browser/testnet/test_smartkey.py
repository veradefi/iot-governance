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
#web3 = Web3(IPCProvider("~/.ethereum/rinkeby/geth.ipc"))
web3 = Web3(HTTPProvider('http://localhost:' + port ))
#web3 = Web3(HTTPProvider('https://rinkeby.infura.io/8BNRVVlo2wy7YaOLcKCR'))
address=web3.toChecksumAddress(web3.eth.coinbase)
address2=web3.toChecksumAddress(web3.eth.accounts[0])

print (address, address2)
gc=getContract('SmartKey',network)
io=getContract('PublicOffering',network)
amount=1000000000000000000 #1 ETH

print ('getBalance (eth) for address1',web3.eth.getBalance(address))
print ('getBalance (eth) for address2',web3.eth.getBalance(address2))
print (io.transact({ 'from': address2, 'value': amount}).loadSmartKey(address2))
print ('convertToToken', gc.call({ 'from': address2}).convertToToken(amount))
print ('getBalance', gc.call({ 'from': address2}).getBalance(address2))
print ('getSmartKey', gc.call({ 'from': address2 }).getSmartKey(address2))
key=gc.call({ 'from': address2 }).getSmartKey(address2)
kc=getContract('Key',network, key, prefix="pki_")
print (gc.transact({ 'from': address2, 'value': amount}).loadSmartKey(key, address2, "Deposit".encode('utf-8')))
print ('Key Activated', kc.call({ 'from': address2}).activated(address2))
print ('Key State', kc.call({ 'from': address2}).state())
print ('getBalance (eth) for address1',web3.eth.getBalance(address))

print ('getBalance (eth) for address1',web3.eth.getBalance(address))
print ('getBalance (eth) for address2',web3.eth.getBalance(address2))
print ('getBalance (eth) for key',web3.eth.getBalance(key))

eth1=1000000000000000000;
eth_contrib=int(eth1/100000);

addAuthKey(kc, address2)
getApiKey(kc, address2, eth_contrib)

    
'''

        xhr.setRequestHeader("Accept","application/vvv.website+json;version=1");
        xhr.setRequestHeader("Authorization", data); 


'''
