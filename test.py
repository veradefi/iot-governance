# -*- coding: utf-8 -*-
import json
from web3 import Web3, KeepAliveRPCProvider, IPCProvider, contract

import sys
import json
import codecs
import StringIO
import re
import os

def getContract(item, network):
    abi = json.loads(open('bin/' + item + '.abi').read())
    bin = open('bin/' + item + '.bin').read()
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
ico=getContract('ICO',network)

print (gc.transact({ 'from': web3.eth.coinbase, 'value': 1000000000000000000}).buySmartKey(address2))
print (gc.call({ 'from': web3.eth.coinbase, 'value': 1000000000000000000}).buySmartKey(address2))
print (gc.transact({ 'from': web3.eth.coinbase}).setRate(web3.toWei('1', 'ether')))


 
print ('ICO')
print (ico.call({ 'from': web3.eth.coinbase}).hasEnded() )
print (ico.call({ 'from': web3.eth.coinbase}).getNow())
 
print (ico.transact({ 'from': address, 'gas':1000000, 'value': 10000000000000000}).buySmartKey(address2))
print (ico.call({ 'from': web3.eth.coinbase}).getTokensMinted())
 
print (ico.transact({ 'from': web3.eth.coinbase}).setRate(web3.toWei('1', 'ether')))
print (ico.transact({ 'from': web3.eth.coinbase, 'gas':1000000, 'value': 10000000000000000}).buySmartKey(address2))
print (ico.call({ 'from': web3.eth.coinbase}).getTokensMinted())
 
print (gc.call({ 'from': web3.eth.coinbase}).getBalance(address2))
print (ico.call({ 'from': web3.eth.coinbase}).rate())
print (ico.call({ 'from': web3.eth.coinbase}).weiRaised())

