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

print (address, address2)
gc=getContract('SmartKey',network)
io=getContract('PublicOffering',network)
root=getContract('GraphRoot',network)
smartNode=getContract('SmartNode',network)
smartNodeItem=getContract('SmartNodeItem',network)

def getSmartKey(address):
    amount=1000000000000000000 #1 ETH
    
    # get smart key
    print (io.transact({ 'from': address, 'value': amount}).getSmartKey(address))
    #print (gc.transact({ 'from': address, 'value': amount}).getSmartKey(address))
    key=gc.call({ 'from': address }).getKey(address)
    kc=getContract('Key',network, key, prefix="pki_")
    print ('Key Activated', kc.call({ 'from': address}).activated(address))
    print ('Key State', kc.call({ 'from': address}).state())
    print ('getBalance (eth) for address1',web3.eth.getBalance(address))

def getNode(graphRoot):
 
    
    def getMeta(metaData):
        metaJson=[]
        for meta in metaData:
            meta_c=getContract('MetaData',network, meta)
            metaJson.append({'rel':meta_c.call().rel(),
                             'val':meta_c.call().val()})
            #print (meta_c.call().rel(), meta_c.call().val())
            #print ('upsertMetaData',meta_c.transact({ 'from': address }).setVal(datetime.now().strftime("%Y-%m-%d")))
        return metaJson
    
    def getItem(items):
     
        itemJson=[]
        for item in items:
            item_c=getContract('CatalogueItem',network,item)
            #print ('upsertMetaData',item_c.transact({ 'from': address, 'value':1000000 }).upsertMetaData("urn:X-space:rels:launchDate", datetime.now().strftime("%Y-%m-%d")))
            #print ('upsertMetaData',item_c.transact({ 'from': address, 'value':1000000 }).upsertMetaData("urn:X-hypercat:rels:lastUpdated", datetime.now().strftime("%Y-%m-%d1T%H:%M:%SZ")))
            #print ('upsertMetaData',item_c.transact({ 'from': address, 'value':1000000 }).upsertMetaData("urn:X-hypercat:rels:hasDescription:en", ""))
            meta=getMeta(item_c.call({'from':address}).selectMetaData())
        
            itemJson.append({'href':item_c.call().href(),
                             'item-metadata':meta})
        return itemJson

    metaJson=getMeta(graphRoot.call({'from':address}).selectMetaData()) 
    itemJson=getItem(graphRoot.call({'from':address}).selectItems())
    
    cat={"catalogue-metadata":metaJson,"items":itemJson}
    return cat


def addNode(parent_href, href,key,auth, load):
    if href:
        if parent_href: 
            graphRoot=getContract('GraphNode', network, root.call({'from':address}).getGraphNode(parent_href))
            print ('upsertNode', smartNode.transact({ 'from': address, 'value':2 }).upsertNode(graphRoot.address, href))
        else:
            print ('upsertNode', smartNode.transact({ 'from': address, 'value':2}).upsertNode(root.address, href))
            
        graphRoot=getContract('GraphNode', network, root.call({'from':address}).getGraphNode(href))
        print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':2 }).upsertMetaData("urn:Xhypercat:rels:supportsSearch", "urn:X-hypercat:search:lexrange"))
        print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':2 }).upsertMetaData("urn:Xhypercat:rels:supportsSearch", "urn:X-hypercat:search:simple"))
        print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':2 }).upsertMetaData("urn:X-space:rels:launchDate", datetime.now().strftime("%Y-%m-%d")))
        print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':2 }).upsertMetaData("urn:X-hypercat:rels:lastUpdated", datetime.now().strftime("%Y-%m-%d1T%H:%M:%SZ")))
        print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':2 }).upsertMetaData("http://www.w3.org/2003/01/geo/wgs84_pos#lat", "51.508775"))
        print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':2 }).upsertMetaData("http://www.w3.org/2003/01/geo/wgs84_pos#long", "-0.116993"))
        print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':2 }).upsertMetaData("urn:X-hypercat:rels:isContentType", "application/vnd.hypercat.catalogue+json"))
        print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':2 }).upsertMetaData("urn:X-hypercat:rels:hasDescription:en", ""))

    
    data={}
    data= getNode(graphRoot)
    
    return data


def addItemData(parent_href, href,key,auth, load):
    data={}
    
    if href:
        addNode(parent_href, href,key,auth, load)
        if parent_href:
            graphRoot=getContract('GraphNode', network, root.call({'from':address}).getGraphNode(parent_href))
        else:
            graphRoot=root
            
        print ('upsertNodeItem', smartNodeItem.transact({ 'from': address, 'value':2 }).upsertItem(graphRoot.address, href))
        
        item_c=getContract('CatalogueItem',network,graphRoot.call({'from':address}).getItem(href))        
        print ('upsertMetaData',item_c.transact({ 'from': address, 'value':2 }).upsertMetaData("urn:X-hypercat:rels:isContentType", "application/vnd.hypercat.catalogue+json"))
        print ('upsertMetaData',item_c.transact({ 'from': address, 'value':2 }).upsertMetaData("urn:X-space:rels:launchDate", datetime.now().strftime("%Y-%m-%d")))
        print ('upsertMetaData',item_c.transact({ 'from': address, 'value':2 }).upsertMetaData("urn:X-hypercat:rels:lastUpdated", datetime.now().strftime("%Y-%m-%d1T%H:%M:%SZ")))
        print ('upsertMetaData',item_c.transact({ 'from': address, 'value':2 }).upsertMetaData("urn:X-hypercat:rels:hasDescription:en", ""))
        
        if (graphRoot != '0x0'):
            data= getNode(graphRoot)
    
    return data


def addNodeMetaData(href,key,auth, rel, val):
    if href:
        graphRoot=getContract('GraphNode', network, root.call({'from':address}).getGraphNode(href))
        print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':2 }).upsertMetaData(rel,val))
    
    data={}
    data= getNode(graphRoot)
    
    return data

def addNodeItemMetaData(href,key,auth, rel, val):
    if href:
        graphRoot=getContract('GraphNode', network, root.call({'from':address}).getGraphNode(href))
        print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':2 }).upsertMetaData(rel,val))
    
    data={}
    data= getNode(graphRoot)
    
    return data


if __name__ == '__main__':
    print( addItemData('', 'https://iotblock.io/test555',address, '', 2))



2