# -*- coding: utf-8 -*-
import json
from web3 import Web3, KeepAliveRPCProvider, IPCProvider, contract

import sys
import json
import codecs
import StringIO
import re
import os

def getContract(item, network, address=None, prefix=""):
    abi = json.loads(open('bin/' + prefix +  item + '_sol_' + item + '.abi').read())
    bin = open('bin/' + prefix + item + '_sol_' +  item + '.bin').read()
    json_data=open('build/contracts/' + item + '.json').read()
    data = json.loads(json_data)
    
    address=data['networks'][network]['address']
    conf_c = web3.eth.contract(abi=abi, bytecode=bin)
    conf=conf_c(address)
    return conf

network='5'
port='8545'
web3 = Web3(KeepAliveRPCProvider(host='localhost', port=port))
address=web3.eth.coinbase
address2=web3.eth.accounts[1]

print (address, address2)
gc=getContract('SmartKey',network)
io=getContract('PublicOffering',network)

print (gc.transact({ 'from': web3.eth.coinbase, 'value': 1000000000000000000}).addSmartKey(address2))
print (gc.call({ 'from': web3.eth.coinbase, 'value': 1000000000000000000}).addSmartKey(address2))
print (gc.transact({ 'from': web3.eth.coinbase}).setRate(web3.toWei('1', 'ether')))


 
print ('ICO')
print (io.call({ 'from': web3.eth.coinbase}).hasEnded() )
print (io.call({ 'from': web3.eth.coinbase}).getNow())
 
print (io.transact({ 'from': address, 'gas':1000000, 'value': 10000000000000000}).addSmartKey(address2))
print (io.call({ 'from': web3.eth.coinbase}).getTokensMinted())
 
print (io.transact({ 'from': web3.eth.coinbase}).setRate(web3.toWei('1', 'ether')))
print (io.transact({ 'from': web3.eth.coinbase, 'gas':1000000, 'value': 10000000000000000}).addSmartKey(address2))
print (io.call({ 'from': web3.eth.coinbase}).getTokensMinted())
 
print (gc.call({ 'from': web3.eth.coinbase}).getBalance(address2))
print (io.call({ 'from': web3.eth.coinbase}).rate())
print (io.call({ 'from': web3.eth.coinbase}).weiRaised())

