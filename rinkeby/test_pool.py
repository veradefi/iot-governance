# -*- coding: utf-8 -*-
import json
from web3 import Web3, IPCProvider, contract, HTTPProvider

import sys
import json
import codecs
import re
import os
from datetime import datetime

def getContract(item, network, address=None, prefix=""):
    abi = json.loads(open('bin/' + prefix +  item + '_sol_' + item + '.abi').read())
    bin = open('bin/' + prefix + item + '_sol_' +  item + '.bin').read()
    json_data=open('build/contracts/' + item + '.json').read()
    data = json.loads(json_data)
    
    if address is None:
        address=data['networks'][network]['address']
    print(address)
    address=web3.toChecksumAddress(address)
    print(address)
    conf_c = web3.eth.contract(abi=abi, bytecode=bin)
    conf=conf_c(address)
    return conf

network='4'
port='8666'
#web3 = Web3(IPCProvider("~/.ethereum/rinkeby/geth.ipc"))
web3 = Web3(HTTPProvider('http://35.165.47.77:' + port ))
#web3 = Web3(HTTPProvider('https://rinkeby.infura.io/8BNRVVlo2wy7YaOLcKCR'))
address2=web3.eth.coinbase
address=web3.eth.accounts[1]

address4=Web3.toChecksumAddress('0x51325acb7c6878706c36635251f3c355d6de4f5a')
address3=Web3.toChecksumAddress('0x813047c6d1ffb32e740d2e92755ca1631edd3f23')
address5=Web3.toChecksumAddress('0x330a0e70f48dedd136961c0b7c59a29ad772e91b')
address6=address4

amount=10000000000000000000
#web3.eth.sendTransaction({ 'from' :address2, 'to':address5, 'value': amount})
#web3.eth.sendTransaction({ 'from' :address, 'to':address4, 'value': amount})


spk=getContract('SmartPoolKey',network);

max_contrib=100000000000000000000000
max_per_contrib=100000000000000000000000
min_per_contrib=1
admins=[ address, address2, address3, address4, address5, address6 ]
whitelist=admins
fee=int(round(1/0.05))
#address, uint256, uint256, uint256, address[], address[], uint256
print (address3, max_contrib, max_per_contrib, min_per_contrib, admins, whitelist, fee)
has_whitelist=False
autoDistribute=True
print(spk.transact({ 'from': address}).addSmartPoolKey(address3, max_contrib, max_per_contrib, min_per_contrib, admins, has_whitelist, fee, autoDistribute))
poolkey=spk.call({ 'from': address}).getSmartPoolKey(address3)
print(poolkey)
pk=getContract('PoolKey', network, address=poolkey, prefix='pki_')
members=pk.call({ 'from': address}).getMembers()
print ('Members:',members)
bal1=web3.eth.getBalance(address2)
print ('getBalance (eth) for address1',bal1)
web3.eth.sendTransaction({ 'from' :address, 'to':poolkey, 'value': amount})
bal2=web3.eth.getBalance(address2)
print ('getBalance (eth) for address1',bal2)
share=bal2-bal1
print ('Shared Contribution',share, round(float(share)/amount*100),'% PurePL',float(1)/len(members) * 100,'%')
print ('Fee',float(1)/pk.call({ 'from': address}).fee() * 100,'%') 
print ('Member Contribution',pk.call({ 'from': address}).isMember(address))
print ('Total Contribution',pk.call({ 'from': address}).contrib_amount())
print ('Sent',amount);
print ('Received',pk.call({ 'from': address}).received(address))
print ('Transactions',pk.call({ 'from': address}).transactions(address, 0))

