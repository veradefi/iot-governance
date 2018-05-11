# -*- coding: utf-8 -*-
import json
from web3 import Web3, KeepAliveRPCProvider, IPCProvider, contract, HTTPProvider

import sys
import json
import codecs
import re
import os
from time import sleep

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

network='4'
port='8666'
web3 = Web3(KeepAliveRPCProvider(host='localhost', port=port))
#web3 = Web3(HTTPProvider('https://iotblock.io/rpc'))
address2=web3.eth.coinbase
address=web3.eth.accounts[0]

print (address, address2)
gc=getContract('SmartKey',network)
io=getContract('PublicOffering',network)
root=getContract('GraphRoot',network)
smartNode=getContract('SmartNode',network)
amount=1000000000000000000 #1 ETH

price=amount/100
amount=amount/100

auth={ 'auth':address }

# get smart key
key=gc.call({ 'from': address}).smartKeys(address);
print (key)
if key == '0x0000000000000000000000000000000000000000':
    print (gc.transact({ 'from': address, 'value': amount}).loadSmartKey(key, address, "Deposit"))
    key=gc.call({ 'from': address}).smartKeys(address);
    print(key)
    kc=getContract('Key',network, key, prefix="pki_")
else:
    kc=getContract('Key',network, key, prefix="pki_")

print (key, address, "Deposit")
print (gc.transact({ 'from': address, 'value': amount}).loadSmartKey(key, address, "Deposit"))
#print (gc.transact({ 'from': address, 'value': amount}).loadSmartKey(address))
kc=getContract('Key',network, key, prefix="pki_")
print ('Key Activated', kc.call({ 'from': address}).activated(address))
print ('Key State', kc.call({ 'from': address}).state())
print ('getBalance (eth) for address1',web3.eth.getBalance(address))


def upsertNode(graphAddr, href, auth, contrib):
    if not re.search('/cat$',href):
        tx=smartNode.transact({ 'from': address, 'value':contrib * 3 }).upsertItem(graphAddr, href)
        print ('upsertItem', tx)
        tx_log=web3.eth.getTransaction(tx)
        tx_receipt=web3.eth.getTransactionReceipt(tx)
        addr=root.call({'from':address}).getItem(href)
        print(href, 'Node Address',addr)
    
        while addr == '0x0000000000000000000000000000000000000000' and (tx_receipt is None or tx_log['blockNumber'] is None):
             tx_log=web3.eth.getTransaction(tx)
             print('getTransaction',tx_log)
             tx_receipt=web3.eth.getTransactionReceipt(tx)
             print('getTransactionReceipt',tx_receipt)
             addr=root.call({'from':address}).getItem(href)
             print(href, 'Node Address',addr)
             print("Waiting for Transaction Completion")
             sleep(10)
    
        graphRoot=getContract('GraphNode', network, root.call({'from':address}).getItem(href))
    else:
        graphRoot=root
    #print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':2 }).upsertMetaData("urn:X-hypercat:rels:supportsSearch", "urn:X-hypercat:search:lexrange"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':contrib }).upsertMetaData("urn:X-hypercat:rels:supportsSearch", "urn:X-hypercat:search:simple"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':contrib }).upsertMetaData("urn:X-space:rels:launchDate", datetime.now().strftime("%Y-%m-%d")))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':contrib }).upsertMetaData("urn:X-hypercat:rels:lastUpdated", datetime.now().strftime("%Y-%m-%d1T%H:%M:%SZ")))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':contrib }).upsertMetaData("http://www.w3.org/2003/01/geo/wgs84_pos#lat", "51.508775"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':contrib }).upsertMetaData("http://www.w3.org/2003/01/geo/wgs84_pos#long", "-0.116993"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':contrib }).upsertMetaData("urn:X-hypercat:rels:isContentType", "application/vnd.hypercat.catalogue+json"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':contrib }).upsertMetaData("urn:X-hypercat:rels:hasDescription:en", ""))
    
    print ('Owner', graphRoot.transact({'from':address}).addOwner(auth['auth']));
    print ('Admin', graphRoot.transact({'from':address}).addAdmin(auth['auth']));

    
def getData(graphRoot, href):

    def getMeta(metaData):
        try:
            metaJson=[]
            for meta in metaData:
                meta_c=getContract('MetaData',network, meta)
                metaJson.append({'rel':meta_c.call().rel(),
                                 'val':meta_c.call().val()})
                print (meta_c.call().rel(), meta_c.call().val())
                #print ('upsertMetaData',meta_c.transact({ 'from': address }).setVal(datetime.now().strftime("%Y-%m-%d")))
            return metaJson
        except Exception as e:
            print (e)
    metaJson=[]
    
    try:
        metaJson=getMeta(graphRoot.call({'from':address}).selectMetaData())
    except Exception as e:
        print (e)

 
    itemJson=[]
    try:
        items=graphRoot.call({'from':address}).selectItems()
     
        for item in items:
            item_c=getContract('Catalogue',network,item)
            meta=getMeta(item_c.call({'from':address}).selectMetaData())
        
            itemJson.append({'href':item_c.call().href(),
                             'item-metadata':meta})
    except Exception as e:
        print (e)
    import json
    
    cat={"catalogue-metadata":metaJson,"items":itemJson}
    print(json.dumps(cat,sort_keys=True, indent=4))

href="https://iotblock.io/cat"
upsertNode(root.address, href, auth, price)
getData(root, href)


href="https://iotblock.io/cat/brand"
upsertNode(root.address, href, auth, price)
brand=getContract('GraphNode', network, root.call({'from':address}).getItem(href))
getData(brand, href)

href="https://iotblock.io/cat/brand/iotblock"
upsertNode(brand.address, href, auth, price)
iotblock=getContract('GraphNode', network, brand.call({'from':address}).getItem(href))
getData(iotblock, href)

href="https://iotblock.io/cat/location"
upsertNode(root.address, href, auth, price)
location=getContract('GraphNode', network, root.call({'from':address}).getItem(href))
getData(location, href)

href="https://iotblock.io/cat/location/earth"
upsertNode(location.address, href, auth, price)
earth=getContract('GraphNode', network, root.call({'from':address}).getItem(href))
getData(earth, href)

href="https://iotblock.io/cat/location/earth/singapore"
upsertNode(earth.address, href, auth, price)
singapore=getContract('GraphNode',network, root.call({'from':address}).getItem(href))
getData(singapore, href)

href="https://iotblock.io/cat/location/earth/singapore/changee"
upsertNode(singapore.address, href, auth, price)
changee=getContract('GraphNode',network, root.call({'from':address}).getItem(href))
getData(changee, href)

href="https://iotblock.io/cat/location/earth/singapore/changee/airport"
upsertNode(changee.address, href, auth, price)
airport=getContract('GraphNode',network, root.call({'from':address}).getItem(href))
getData(airport, href)

'''
"catalogue-metadata":[
{
"rel":"urn:X-hypercat:rels:isContentType",
"val":"application/vnd.hypercat.catalogue+json"
},
{
"rel":"urn:X-hypercat:rels:hasDescription:en", "val":""
}
],
"items":[
]
}
'''
