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
    json_data=open('src/solc/contracts/' + item + '.json').read()
    data = json.loads(json_data)
    
    if address is None:
        address=data['networks'][network]['address']
    print(address)
    address=web3.toChecksumAddress(address)
    print(address)
    conf_c = web3.eth.contract(abi=abi, bytecode=bin)
    conf=conf_c(address)
    return conf

network='4447'
port='9545'
#web3 = Web3(IPCProvider("~/.ethereum/rinkeby/geth.ipc"))
web3 = Web3(HTTPProvider('http://127.0.0.1:' + port ))
#web3 = Web3(HTTPProvider('https://rinkeby.infura.io/8BNRVVlo2wy7YaOLcKCR'))
address=web3.eth.coinbase
address2=web3.eth.accounts[1]

address3=Web3.toChecksumAddress('0xd299b70785dc4b08f892cf13ce7a78b11aa276f7')
address4=Web3.toChecksumAddress('0x51325acb7c6878706c36635251f3c355d6de4f5a')
address5=Web3.toChecksumAddress('0x813047c6d1ffb32e740d2e92755ca1631edd3f23')
#address6=address4

amount         =1005000000000000000
max_contrib    =100000000000000000000
max_per_contrib=100000000000000000000
web3.eth.sendTransaction({ 'from' :address2, 'to':address5, 'value': amount})
web3.eth.sendTransaction({ 'from' :address, 'to':address4, 'value': amount})
web3.eth.sendTransaction({ 'from' :address, 'to':address3, 'value': amount})

web3.eth.sendTransaction({ 'from' :web3.eth.coinbase, 'to':'0x51325ACb7c6878706c36635251f3C355D6De4F5a', 'value': 1005000000000000000})
spk=getContract('SmartPoolKey',network);

min_per_contrib=1
admins=[ address, address2, address3, address4, address5 ]
whitelist=admins
fee=int(round(1/0.05))
#address, uint256, uint256, uint256, address[], address[], uint256
print (address3, max_contrib, max_per_contrib, min_per_contrib, admins, whitelist, fee)
has_whitelist=False
autoDistribute=True
print(spk.transact({ 'from': address}).addSmartPoolKey(address, max_contrib, max_per_contrib, min_per_contrib, admins, has_whitelist, fee, autoDistribute))
poolkey=spk.call({ 'from': address}).getSmartPoolKey(address)
print(poolkey)
pk=getContract('PoolKey', network, address=poolkey, prefix='pki_')
members=pk.call({ 'from': address}).getMembers()
print ('Members:',members)
bal1=web3.eth.getBalance(address)
print ('getBalance (eth) for address1',bal1)
web3.eth.sendTransaction({ 'from' :address, 'to':poolkey, 'gas': 4000000, 'gasPrice':1000000000, 'value': amount})
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

