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

price=amount/10000
amount=amount/10000

# get smart key
print (io.transact({ 'from': address, 'value': amount}).addSmartKey(address))
#print (gc.transact({ 'from': address, 'value': amount}).addSmartKey(address))
key=gc.call({ 'from': address }).getSmartKey(address)
kc=getContract('Key',network, key, prefix="pki_")
print ('Key Activated', kc.call({ 'from': address}).activated(address))
print ('Key State', kc.call({ 'from': address}).state())
print ('getBalance (eth) for address1',web3.eth.getBalance(address))

def fillData(graphRoot, href):
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':price }).upsertMetaData("urn:Xhypercat:rels:supportsSearch", "urn:X-hypercat:search:lexrange"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':price }).upsertMetaData("urn:Xhypercat:rels:supportsSearch", "urn:X-hypercat:search:simple"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':price }).upsertMetaData("urn:X-space:rels:launchDate", datetime.now().strftime("%Y-%m-%d")))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':price }).upsertMetaData("urn:X-hypercat:rels:lastUpdated", datetime.now().strftime("%Y-%m-%d1T%H:%M:%SZ")))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':price }).upsertMetaData("http://www.w3.org/2003/01/geo/wgs84_pos#lat", "51.508775"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':price }).upsertMetaData("http://www.w3.org/2003/01/geo/wgs84_pos#long", "-0.116993"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':price }).upsertMetaData("urn:X-hypercat:rels:isContentType", "application/vnd.hypercat.catalogue+json"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':price }).upsertMetaData("urn:X-hypercat:rels:hasDescription:en", ""))

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
fillData(root, href)


href="https://iotblock.io/cat/brand"
print ('upsertItem', smartNode.transact({ 'from': address, 'value':price }).upsertItem(root.address, href))
brand=getContract('GraphNode', network, root.call({'from':address}).getItem(href))
fillData(brand, href)

href="https://iotblock.io/cat/brand/iotblock"
print ('upsertItem', smartNode.transact({ 'from': address, 'value':price }).upsertItem(brand.address, href))
iotblock=getContract('GraphNode', network, brand.call({'from':address}).getItem(href))
fillData(iotblock, href)


href="https://iotblock.io/cat/location"

print ('upsertItem', smartNode.transact({ 'from': address, 'value':price }).upsertItem(root.address, href))
location=getContract('GraphNode', network, root.call({'from':address}).getItem(href))
fillData(location, href)

href="https://iotblock.io/cat/location/earth"
print ('upsertItem', smartNode.transact({ 'from': address, 'value':price }).upsertItem(location.address, href))
earth=getContract('GraphNode', network, location.call({'from':address}).getItem(href))
fillData(earth, href)

href="https://iotblock.io/cat/location/earth/singapore"
print ('upsertItem', smartNode.transact({ 'from': address, 'value':price }).upsertItem(earth.address, href))
singapore=getContract('GraphNode',network, earth.call({'from':address}).getItem(href))
fillData(singapore, href)

href="https://iotblock.io/cat/location/earth/singapore/changee"
print ('upsertItem', smartNode.transact({ 'from': address, 'value':price }).upsertItem(singapore.address, href))
changee=getContract('GraphNode',network, singapore.call({'from':address}).getItem(href))
fillData(changee, href)

href="https://iotblock.io/cat/location/earth/singapore/changee/airport"

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
