# -*- coding: utf-8 -*-
import json
from web3 import Web3, KeepAliveRPCProvider, IPCProvider, contract, HTTPProvider

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
    conf_c = web3.eth.contract(abi=abi, bytecode=bin)
    conf=conf_c(address)
    return conf

network='5'
port='8545'
web3 = Web3(KeepAliveRPCProvider(host='localhost', port=port))
#web3 = Web3(HTTPProvider('https://iotblock.io/rpc'))
address2=web3.eth.coinbase
address=web3.eth.accounts[1]

address3='0x04F1C2fCed3A83546af51769E0139A84AdD841D2'
address4='0x63Ef6B75B8746a1A5eD4B7A16bCeC856A4245544'


amount=10000000000000000000
#web3.eth.sendTransaction({ 'from' :address2, 'to':address3, 'value': amount})
#web3.eth.sendTransaction({ 'from' :address, 'to':address4, 'value': amount})


spk=getContract('SmartPoolKey',network);

max_contrib=100000000000000000000000
max_per_contrib=100000000000000000000000
min_per_contrib=1
admins=[ address, address2, address3, address4 ]
whitelist=admins
fee=int(round(1/0.05))
#address, uint256, uint256, uint256, address[], address[], uint256
print (address3, max_contrib, max_per_contrib, min_per_contrib, admins, whitelist, fee)
has_whitelist=False
print(spk.transact({ 'from': address}).addSmartPoolKey(address3, max_contrib, max_per_contrib, min_per_contrib, admins, has_whitelist, fee))
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
print ('Transactions',pk.call({ 'from': address}).transactions(address, 1))

