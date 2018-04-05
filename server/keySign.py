# -*- coding: utf-8 -*-
import json
from web3 import Web3, KeepAliveRPCProvider, IPCProvider, contract, HTTPProvider
from flask import request
import json
import sys
import json
import codecs
import StringIO
import re
import os
from datetime import datetime
from flask import Flask
from Crypto.Signature import pkcs1_15
import Crypto.Hash.MD5 as MD5
import Crypto.PublicKey.RSA as RSA
import Crypto.PublicKey.DSA as DSA
import Crypto.PublicKey.ElGamal as ElGamal
import Crypto.Util.number as CUN
from Crypto.Hash import SHA256
import os


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

print ('eth1, eth2', address, address2)
gc=getContract('SmartKey',network)
io=getContract('PublicOffering',network)
root=getContract('GraphRoot',network)
smartNode=getContract('SmartNode',network)
smartNodeItem=getContract('SmartNodeItem',network)
smartKey=getContract('SmartKey',network)

def authKey(address, auth):
    
    keyAddress=gc.call({ 'from': address }).getSmartKey(address)
    print (keyAddress)
    if keyAddress != '0x0000000000000000000000000000000000000000':
        key=getContract('Key',network, keyAddress, prefix="pki_")
        
        try:
            
            #print ('Key Activated', kc.call({ 'from': address}).activated(address))
            #print ('Key State', kc.call({ 'from': address}).state())
            #print ('getBalance (eth) for address1',web3.eth.getBalance(address))
    
            #eth_sent=key.call({'from':address}).activated(graphRoot.address)
            balance=web3.eth.getBalance(key.address)
            amount=key.call({'from':address}).contrib_amount()
            state=key.call({'from':address}).state()
            health=key.call({'from':address}).health()
            tokens=smartKey.call({'from':address}).balanceOf(key.address)
            #transactions=key.call({'from':address}).transactions(key.address,0)
            vault=key.call({'from':address}).vault()
            #amount=tokens
        except Exception as e:
            print (e)
        
        cat = { 
                "address":keyAddress,
                "eth_recv":amount,
                "balance":balance,
                "state":state,
                "health":health,
                "tokens":tokens,
                #"transactions":transactions,
                "vault":vault,
                
                }
    else:
        cat = { 
                "address":"0x0000000000000000000000000000000000000000",
                "eth_recv":0,
                "balance":0,
                "state":0,
                "health":0,
                "tokens":0,
                #"transactions":transactions,
                "vault":"0x0000000000000000000000000000000000000000",
                
                }
    print(cat)
    
    return cat

plaintext = 'testuser@testing.com:test123'

# Here is a hash of the message
hash = MD5.new(plaintext).hexdigest()
print('Hash Auth', hash)

# Generates a fresh public/private key pair
key = RSA.generate(1024, os.urandom)

message = plaintext + ":" + str(address)
print("Message:",message)
#key = RSA.importKey(open('private_key.der').read())
h = SHA256.new(message)
signature = pkcs1_15.new(key).sign(h)
K = ''

# You sign the hash
#signature = key.sign(hash, K)
print(len(signature), RSA.__name__)
# (1, 'Crypto.PublicKey.RSA')

# You share pubkey with Friend
'''
cat['catalogue-metadata'].push({
        'rel': 'urn:X-hypercat:rels:jws:signature',
        'val': privKey.sign(stringify(cat, sorter)).toString('base64')
});
cat['catalogue-metadata'].push({
        rel: 'urn:X-hypercat:rels:jws:alg',
        val: 'RS256'
});
cat['catalogue-metadata'].push({
        rel: 'urn:X-hypercat:rels:jws:key',
        val: pubKey.exportKey('pkcs8-public-pem')
});
'''
pubkey = key.publickey().exportKey('PEM')
privkey = key.exportKey('PEM')

print (pubkey, privkey)
try:
    pkcs1_15.new(key).verify(h, signature)
    print ("The signature is valid.")
except (ValueError, TypeError):
    print ("The signature is not valid.")
