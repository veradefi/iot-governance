# -*- coding: utf-8 -*-
import json
from web3 import Web3, KeepAliveRPCProvider, IPCProvider, contract

import sys
import json
import codecs
import StringIO
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
address2=web3.eth.coinbase
address=web3.eth.accounts[1]

print (address, address2)
gc=getContract('SmartKey',network)
io=getContract('PublicOffering',network)
root=getContract('GraphRoot',network)
smartNode=getContract('SmartNode',network)
smartNodeItem=getContract('SmartNodeItem',network)
amount=1000000000000000000 #1 ETH

# get smart key
print (io.transact({ 'from': address, 'value': amount}).getSmartKey(address))
#print (gc.transact({ 'from': address, 'value': amount}).getSmartKey(address))
key=gc.call({ 'from': address }).getKey(address)
kc=getContract('Key',network, key, prefix="pki_")
print ('Key Activated', kc.call({ 'from': address}).activated(address))
print ('Key State', kc.call({ 'from': address}).state())
print ('getBalance (eth) for address1',web3.eth.getBalance(address))

def fillData(graphRoot, href, fillItem=True):
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':1000000 }).upsertMetaData("urn:Xhypercat:rels:supportsSearch", "urn:X-hypercat:search:lexrange"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':1000000 }).upsertMetaData("urn:Xhypercat:rels:supportsSearch", "urn:X-hypercat:search:simple"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':1000000 }).upsertMetaData("urn:X-space:rels:launchDate", datetime.now().strftime("%Y-%m-%d")))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':1000000 }).upsertMetaData("urn:X-hypercat:rels:lastUpdated", datetime.now().strftime("%Y-%m-%d1T%H:%M:%SZ")))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':1000000 }).upsertMetaData("http://www.w3.org/2003/01/geo/wgs84_pos#lat", "51.508775"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':1000000 }).upsertMetaData("http://www.w3.org/2003/01/geo/wgs84_pos#long", "-0.116993"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':1000000 }).upsertMetaData("urn:X-hypercat:rels:isContentType", "application/vnd.hypercat.catalogue+json"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':1000000 }).upsertMetaData("urn:X-hypercat:rels:hasDescription:en", ""))
    
    def getMeta(metaData):
        metaJson=[]
        for meta in metaData:
            meta_c=getContract('MetaData',network, meta)
            metaJson.append({'rel':meta_c.call().rel(),
                             'val':meta_c.call().val()})
            print (meta_c.call().rel(), meta_c.call().val())
            #print ('upsertMetaData',meta_c.transact({ 'from': address }).setVal(datetime.now().strftime("%Y-%m-%d")))
        return metaJson
    
    metaJson=getMeta(graphRoot.call({'from':address}).selectMetaData())
 
    if fillItem:
        print ('upsertNodeItem', smartNodeItem.transact({ 'from': address, 'value':100000 }).upsertItem(graphRoot.address, href))
        graphItem=getContract('GraphRoot',network, graphRoot.call({'from':address}).getItem(href))

    #print ('upsertItem',graphRoot.transact({ 'from': address, 'value':1000000 }).upsertItem("https://iotblock.io/cat"))
    items=graphRoot.call({'from':address}).selectItems()
 
    itemJson=[]
    for item in items:
        item_c=getContract('CatalogueItem',network,item)
        print ('upsertMetaData',item_c.transact({ 'from': address, 'value':1000000 }).upsertMetaData("urn:X-space:rels:launchDate", datetime.now().strftime("%Y-%m-%d")))
        print ('upsertMetaData',item_c.transact({ 'from': address, 'value':1000000 }).upsertMetaData("urn:X-hypercat:rels:lastUpdated", datetime.now().strftime("%Y-%m-%d1T%H:%M:%SZ")))
        print ('upsertMetaData',item_c.transact({ 'from': address, 'value':1000000 }).upsertMetaData("urn:X-hypercat:rels:hasDescription:en", ""))
        meta=getMeta(item_c.call({'from':address}).selectMetaData())
    
        itemJson.append({'href':item_c.call().href(),
                         'item-metadata':meta})
    import json
    
    cat={"catalogue-metadata":metaJson,"items":itemJson}
    print(json.dumps(cat,sort_keys=True, indent=4))

href="https://iotblock.io/cat/earth"
fillData(root, href)

print ('upsertNode', smartNode.transact({ 'from': address, 'value':1000000 }).upsertNode(root.address, href))
earth=getContract('GraphNode', network, root.call({'from':address}).getGraphNode(href))

href="https://iotblock.io/cat/earth/singapore"
fillData(earth, href)

print ('upsertNode', smartNode.transact({ 'from': address, 'value':1000000 }).upsertNode(earth.address, href))
singapore=getContract('GraphNode',network, earth.call({'from':address}).getGraphNode(href))

href="https://iotblock.io/cat/earth/singapore/changee"
fillData(singapore, href)

print ('upsertNode', smartNode.transact({ 'from': address, 'value':1000000 }).upsertNode(singapore.address, href))
changee=getContract('GraphNode',network, singapore.call({'from':address}).getGraphNode(href))

href="https://iotblock.io/cat/earth/singapore/changee/airport"
fillData(changee, href, False)

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
