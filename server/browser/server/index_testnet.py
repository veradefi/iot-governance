# -*- coding: utf-8 -*-
import json
import traceback
from web3 import Web3, IPCProvider, contract, HTTPProvider
from flask import request, Flask, Response
import json
import sys
import json
import codecs
import re
import os
from time import sleep
from datetime import datetime
import base64
import threading
from flask import Flask
import gevent
#from gevent.wsgi import WSGIServer
from gevent.queue import Queue
import threading, logging, time
import multiprocessing
from kafka import KafkaConsumer, KafkaProducer

rootNode="https://iotblock.io/"
def getContract(item, network, address=None, prefix=""):
    abi = json.loads(open('bin/' + prefix +  item + '_sol_' + item + '.abi').read())
    bin = open('bin/' + prefix + item + '_sol_' +  item + '.bin').read()
    json_data=open('src/solc/contracts/' + item + '.json').read()
    data = json.loads(json_data)
    
    if address is None:
        address=data['networks'][network]['address']
    #print(address)
    address=web3.toChecksumAddress(address)
    #print(address)
    conf_c = web3.eth.contract(abi=abi, bytecode=bin)
    conf=conf_c(address)
    return conf

network='4447'
port='9545'
#web3 = Web3(IPCProvider("~/.ethereum/rinkeby/geth.ipc"))
#web3 = Web3(HTTPProvider('http://35.165.47.77:' + port ))
web3 = Web3(HTTPProvider('http://127.0.0.1:' + port ))
#web3 = Web3(HTTPProvider('https://rinkeby.infura.io/8BNRVVlo2wy7YaOLcKCR'))
address2=web3.toChecksumAddress(web3.eth.coinbase)
address=web3.toChecksumAddress(web3.eth.accounts[0])

print (address, address2)
gc=getContract('SmartKey',network)
io=getContract('PublicOffering',network)
root=getContract('GraphRoot',network)
smartNode=getContract('SmartNode',network)
smartKey=getContract('SmartKey',network)
subscriptions = []

def authKey(user, auth):
    user=web3.toChecksumAddress(user)
    keyAddress=smartKey.call({ 'from': address }).getSmartKey(user)
    print (keyAddress)
    status=False
    if keyAddress != '0x0000000000000000000000000000000000000000':
        key=getContract('Key',network, keyAddress, prefix="pki_")
        
        isOwner=key.call({'from':address}).isOwner(address);
        print("isOwner",isOwner)
        if not isOwner:
            smartKey.transact({'from':address}).addOwner(user);
            isOwner=key.call({'from':address}).isOwner(address);
            print("isOwner",isOwner)
        
        #print("addKeyAuth", key.transact({'from':address}).addKeyAuth(auth, auth_key))
        try:
            print ("user", user)
            auth_key=key.call({'from':address}).getKeyAuth(user.lower())
            print ("AuthKey", auth_key)
            if auth_key == auth:
                status=True
        except Exception as e:
            print (e)
            traceback.print_exc()
                
        #status=True
    return status, key

def getSmartKey(address, auth=None):
    keyAddress = '0x0000000000000000000000000000000000000000'
    
    try:
        keyAddress=gc.call({ 'from': address }).getSmartKey(web3.toChecksumAddress(address))
        print (keyAddress)
    except Exception as e:
        print(e)
        traceback.print_exc()
        
    if keyAddress != '0x0000000000000000000000000000000000000000':
        key=getContract('Key',network, keyAddress, prefix="pki_")
        return getKeyInfo(key, auth)
        
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
                "isOwner":False
                
                }
    print(cat)
    
    return cat


def getSmartKeyTx(address, offset=0, limit=10):
    address=web3.toChecksumAddress(address)
    keyAddress=gc.call({ 'from': address }).getSmartKey(address)
    key=getContract('Key',network, keyAddress, prefix="pki_")

    tx=[]
    try:
        txCount=key.call({'from':address}).getTransactionCount(web3.toChecksumAddress(key.address))
        if offset:
            offset=int(offset)
        else:
            offset=0
        if txCount > 0:
            hasHistory=True
            idx=txCount - 1
            idx -= offset;
            count=0
            while hasHistory and count < limit and idx >= 0:
                transactions=key.call({'from':address}).transactions(web3.toChecksumAddress(key.address),idx)
                account=transactions[0]
                date=transactions[1]
                amount=transactions[2]
                tx_type=transactions[3]
                if account != '0x0' and account != re.search('0x0000000000000000000000000000000000000000',account):
                    tx.append({'account':account,'date':date,'amount':amount, 'tx_type':tx_type})
                    idx-=1
                    count+=1
    except Exception as e:
        print (e)
        traceback.print_exc()
        
    cat = { 
            "transactions":tx,
            "count":txCount,
            "offset":offset
            }

    #print(cat)
    
    return cat

def getKeyInfo(key, auth=None):
    keyAddress=web3.toChecksumAddress(key.address)
    if keyAddress != '0x0000000000000000000000000000000000000000':
     try:
        
        #eth_sent=key.call({'from':address}).activated(graphRoot.address)
        balance=web3.eth.getBalance(key.address)
        amount=key.call({'from':address}).contrib_amount()
        state=key.call({'from':address}).state()
        health=key.call({'from':address}).health()
        tokens=smartKey.call({'from':address}).balanceOf(key.address)
        #transactions=key.call({'from':address}).transactions(key.address,0)
        vault=key.call({'from':address}).vault()
        isOwner=False
        if not auth is None and 'auth' in auth:
            if key.call({'from':address}).isOwner(web3.toChecksumAddress(auth['auth'])):        
                    isOwner=True

        #amount=tokens
     except Exception as e:
        print (e)
        traceback.print_exc()
        
        
     cat = {    "address":keyAddress,
                "eth_recv":amount,
                "balance":balance,
                "state":state,
                "health":health,
                "tokens":tokens,
                #"transactions":transactions,
                "vault":vault,
                "isOwner":isOwner
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
                "isOwner":False
                }
    print(cat)
    
    return cat

def userEthTransfer(amount, beneficiary, sender, key=None,auth=None):
    try:
        amount=int(amount)
        
        keyAddress=smartKey.call({ 'from': address }).getSmartKey(web3.toChecksumAddress(sender))
        
        key=getContract('Key',network, keyAddress, prefix="pki_")
    
        #print("isOwner", key.call({ 'from': address }).isOwner(smartKey.address))
        if not auth is None and key.call({'from':address}).isOwner(web3.toChecksumAddress(auth['auth'])):   
            print('transferEth',smartKey.transact({ 'from': address }).transferEth(amount, sender, beneficiary));
       
        return key
    except Exception as e:
        print (e)
        traceback.print_exc()
        
def setUserHealth(health, userAddress, key=None,auth=None):
    health=int(health)
    userAddress=web3.toChecksumAddress(userAddress)
    keyAddress=web3.toChecksumAddress(smartKey.call({ 'from': address }).getSmartKey(userAddress))
    
    key=getContract('Key',network, keyAddress, prefix="pki_")
    try:
        if auth and auth['eth_contrib']:
            print('setHealth',key.transact({ 'from': address, 'value':int(auth['eth_contrib']) }).setHealth(health))
    except Exception as e:
        print (e)
        traceback.print_exc()
        
    return key

def getNodeKey(href, auth=None):
    try:
        href=re.sub('\/$','',href)
        if re.search('/cat$',href):
            graphRoot=root
        else:
            graphRoot=getContract('GraphNode', network, root.call({'from':address}).getItem(href))
    except Exception as e:
        print (e)
        traceback.print_exc()

    key=getContract('Key',network, graphRoot.address, prefix="pki_")

    try:
        #eth_sent=key.call({'from':address}).activated(graphRoot.address)
        balance=web3.eth.getBalance(graphRoot.address)
        amount=key.call({'from':address}).contrib_amount()
        state=key.call({'from':address}).state()
        health=key.call({'from':address}).health()
        tokens=smartKey.call({'from':address}).balanceOf(key.address)
        #transactions=key.call({'from':address}).transactions(key.address,0)
        vault=key.call({'from':address}).vault()
        #amount=tokens
        isOwner=False
        if not auth is None and 'auth' in auth:
            if graphRoot.call({'from':address}).isOwner(web3.toChecksumAddress(auth['auth'])):        
                    isOwner=True
        
    except Exception as e:
        print (e)
        traceback.print_exc()
        
    cat = { 
            "address":graphRoot.address,
            "eth_recv":amount,
            "balance":balance,
            "state":state,
            "health":health,
            "tokens":tokens,
            #"transactions":transactions,
            "vault":vault,
            "isOwner":isOwner,
            }
    
    return cat

def getNodeKeyTx(href, offset=0, limit=10):
    try:
        href=re.sub('\/$','',href)
        if re.search('/cat$',href):
            graphRoot=root
        else:
            graphRoot=getContract('GraphNode', network, root.call({'from':address}).getItem(href))
    except Exception as e:
        print (e)
        traceback.print_exc()

    key=getContract('Key',network, graphRoot.address, prefix="pki_")

    tx=[]
    try:
        myAddress=key.address;
        txCount=key.call({'from':address}).getTransactionCount(web3.toChecksumAddress(key.address))
        if txCount < 1:
            txCount=key.call({'from':address}).getTransactionCount(web3.toChecksumAddress(address))
            myaddress=address;
        
        if txCount < 1:
            txCount=key.call({'from':address}).getTransactionCount(web3.toChecksumAddress(smartKey.address))
            myaddress=smartKey.address;

        if offset:
            offset=int(offset)
        else:
            offset=0
        count=0
        if txCount > 0:
            hasHistory=True
            idx=txCount - 1
            idx -= offset;
            count=0
            while hasHistory and count < limit and idx >= 0:
                transactions=key.call({'from':address}).transactions(myAddress,idx)
                account=transactions[0]
                date=transactions[1]
                amount=transactions[2]
                tx_type=transactions[3]
                if account != '0x0' and account != re.search('0x0000000000000000000000000000000000000000',account):
                    tx.append({'account':account,'date':date,'amount':amount, 'tx_type':tx_type})
                    idx-=1
                    count += 1
    except Exception as e:
        print (e)
        traceback.print_exc()
        
    cat = { 
            "transactions":tx,
            "count":txCount,
            "offset":offset
            }
    
    return cat



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
    
    def getItem(items, getItems=False):
     
        itemList=[]
        for item in items:
            item_c=getContract('Catalogue',network,item)
            meta=getMeta(item_c.call({'from':address}).selectMetaData())
            itemJson={'href':item_c.call().href(),
                             'item-metadata':meta}
            if getItems:
                itemListJson=getItem(item_c.call({'from':address}).selectItems(), False)
                itemJson['items']=itemListJson;
                
            itemList.append(itemJson)
        return itemList

    metaJson=[]
    itemJson=[]
    
    try:
        if graphRoot.address != '0x0000000000000000000000000000000000000000':
            metaJson=getMeta(graphRoot.call({'from':address}).selectMetaData()) 
            itemJson=getItem(graphRoot.call({'from':address}).selectItems(), True)
        
    except Exception as e:
        print (e)
        traceback.print_exc()
        
    cat = { 
            "catalogue-metadata":metaJson,
            "items":itemJson
          }
    
    return cat


def getNodeBalance(graphRoot):
 
    def getMeta(metaData):
        
        metaJson=[]
        for meta in metaData:
            meta_c=getContract('MetaData',network, meta)
            bal=smartKey.call().getBalance(web3.toChecksumAddress(meta))
            metaJson.append({'rel':meta_c.call().rel(),
                             'val':meta_c.call().val(),
                             'bal':bal})
            #print (meta_c.call().rel(), meta_c.call().val())
            #print ('upsertMetaData',meta_c.transact({ 'from': address }).setVal(datetime.now().strftime("%Y-%m-%d")))
        return metaJson
    
    def getItem(items):
     
        itemJson=[]
        for item in items:
            item_c=getContract('Catalogue',network,item)
            meta=getMeta(item_c.call({'from':address}).selectMetaData())
        
            itemJson.append({'href':item_c.call().href(),
                             'item-metadata':meta})
        return itemJson

    metaJson=[]
    itemJson=[]
    href=""
    
    try:
        href=graphRoot.call({'from':address}).href();
        metaJson=getMeta(graphRoot.call({'from':address}).selectMetaData()) 
        itemJson=getItem(graphRoot.call({'from':address}).selectItems())
        
    except Exception as e:
        print (e)
        traceback.print_exc()
        
    cat = { 
            "href":href,
            "catalogue-metadata":metaJson,
            "items":itemJson
          }
    
    return cat


def upsertNode(graphAddr, href, auth, contrib):
    graphAddr=web3.toChecksumAddress(graphAddr)
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
    print ('Owner', graphRoot.transact({'from':address}).addOwner(auth['auth']));
    print ('Admin', graphRoot.transact({'from':address}).addAdmin(auth['auth']));
    #print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':2 }).upsertMetaData("urn:Xhypercat:rels:supportsSearch", "urn:X-hypercat:search:lexrange"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':contrib }).upsertMetaData("urn:Xhypercat:rels:supportsSearch", "urn:X-hypercat:search:simple"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':contrib }).upsertMetaData("urn:X-space:rels:launchDate", datetime.now().strftime("%Y-%m-%d")))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':contrib }).upsertMetaData("urn:X-hypercat:rels:lastUpdated", datetime.now().strftime("%Y-%m-%d1T%H:%M:%SZ")))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':contrib }).upsertMetaData("http://www.w3.org/2003/01/geo/wgs84_pos#lat", "51.508775"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':contrib }).upsertMetaData("http://www.w3.org/2003/01/geo/wgs84_pos#long", "-0.116993"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':contrib }).upsertMetaData("urn:X-hypercat:rels:isContentType", "application/vnd.hypercat.catalogue+json"))
    print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':contrib }).upsertMetaData("urn:X-hypercat:rels:hasDescription:en", ""))
    

def addNode(parent_href, href, auth, eth_contrib, wait=False):
    data={ 'healthStatus':'Provisioning' }
    
    if href:
        threads = []
        contrib=int(int(eth_contrib) / 10)
        if parent_href: 
            
            try:
                parent_href=re.sub('\/$','',parent_href)
                if re.search('/cat$',parent_href):
                    graphRoot=root
                else:
                    graphRoot=getContract('GraphNode', network, root.call({'from':address}).getItem(parent_href))
            except Exception as e:
                print (e)
                traceback.print_exc()

            print (parent_href, href, address, graphRoot.address, root.address)
            t = threading.Thread(target=upsertNode, args=[graphRoot.address, href, auth, contrib])
            threads.append(t)

        else:
        
            t = threading.Thread(target=upsertNode, args=[root.address, href, auth, contrib])
            threads.append(t)


        for x in threads:
            x.start()
            if wait:
                x.join()
    graphRoot=getContract('GraphNode', network, root.call({'from':address}).getItem(href))
    data= getNodeBalance(graphRoot)

    return data





def addNodeMetaData(node_href,rel, val,auth, eth_contrib, parent_href=rootNode + '/cat'):
    eth_contrib=int(eth_contrib);
    print('addNodeMetaData',node_href);
    if node_href: 
        try:
            node_href=re.sub('\/$','',node_href)
            if re.search('/cat$',node_href):
                graphRoot=root
            else:
                graphRoot=getContract('GraphNode', network, root.call({'from':address}).getItem(node_href))
                if graphRoot.address == '0x0000000000000000000000000000000000000000':
                    data=addNode(parent_href, node_href, auth, int(auth['eth_contrib']), True)
                    graphRoot=getContract('GraphNode', network, root.call({'from':address}).getItem(node_href))
                else:
                    print(node_href,parent_href,graphRoot.address)

        except Exception as e:
            print (e)
            traceback.print_exc()
    
    transactionId=graphRoot.transact({ 'from': address, 'value':eth_contrib }).upsertMetaData(rel, val);
    print("addNodeMetaData",rel,val);
    print ('upsertMetaData',transactionId)
    
    data={}
    data= getNodeBalance(graphRoot)
    
    return data




def addNodeItemMetaData(node_href, href, rel, val, auth, eth_contrib):
    transactionId=''
    if node_href and href:
        if node_href: 
            
            try:
                node_href=re.sub('\/$','',node_href)
                if re.search('/cat$',node_href):
                    graphRoot=root
                    print ("is Root Node")
                else:
                    graphRoot=getContract('GraphNode', network, root.call({'from':address}).getItem(node_href))
            except Exception as e:
                print (e)
                traceback.print_exc()
        else:
            graphRoot=root
        print(node_href, href, graphRoot.call({'from':address}).getItem(href))
        item_c=getContract('GraphNode',network, graphRoot.call({'from':address}).getItem(href))   
        transactionId=item_c.transact({ 'from': address, 'value':eth_contrib }).upsertMetaData(rel,val);
        print ('upsertMetaData',transactionId)
        graphRoot=item_c
        
    data={}
    data= getNodeBalance(graphRoot)
    
    return data


def nodeEthTransfer(amount, beneficiary, href, auth):
    amount=int(amount)
    if href: 
        
        try:
            href=re.sub('\/$','',href)
            if re.search('/cat$',href):
                graphRoot=root
            else:
                graphRoot=getContract('GraphNode', network, root.call({'from':address}).getItem(href))
        except Exception as e:
            print (e)
            traceback.print_exc()
    
    isOwner=False
    if graphRoot.call({'from':address}).isOwner(auth['auth']):        
        print('transferEth',graphRoot.transact({ 'from': address }).transferEth(amount, beneficiary));
        isOwner=True
        
    key=getContract('Key',network, graphRoot.address, prefix="pki_")

    
    try:
        
        #eth_sent=key.call({'from':address}).activated(graphRoot.address)
        balance=web3.eth.getBalance(graphRoot.address)
        amount=key.call({'from':address}).contrib_amount()
        state=key.call({'from':address}).state()
        health=key.call({'from':address}).health()
        tokens=smartKey.call({'from':address}).balanceOf(key.address)
        #transactions=key.call({'from':address}).transactions(key.address,0)
        vault=key.call({'from':address}).vault()
        #amount=tokens
    except Exception as e:
        print (e)
        traceback.print_exc()
        
    cat = { 
            "address":graphRoot.address,
            "eth_recv":amount,
            "balance":balance,
            "state":state,
            "health":health,
            "tokens":tokens,
            #"transactions":transactions,
            "vault":vault,
            "isOwner":isOwner,
            
            }
    
    return cat


def setHealth(health, href, eth_contrib):
    contrib=int(int(eth_contrib) / 2)
    health=int(health)
    if href: 
        
        try:
            href=re.sub('\/$','',href)
            if re.search('/cat$',href):
                graphRoot=root
            else:
                graphRoot=getContract('GraphNode', network, root.call({'from':address}).getItem(href))
        except Exception as e:
            print (e)
            traceback.print_exc()
    healthStates = ['Provisioning', 'Certified', 'Modified', 'Compromised', 'Malfunctioning', 'Harmful', 'Counterfeit' ]


    try:     
        print('transferEth',graphRoot.transact({ 'from': address,  'value':int(contrib) }).setHealth(health))
        print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':int(contrib/2) }).upsertMetaData("urn:X-hypercat:rels:health", str(health)))
        print ('upsertMetaData',graphRoot.transact({ 'from': address, 'value':int(contrib/2) }).upsertMetaData("urn:X-hypercat:rels:healthStatus", healthStates[health]))
    except Exception as e:
        print (e)
        traceback.print_exc()
        
    key=getContract('Key',network, graphRoot.address, prefix="pki_")

    return key;
    


def metaSearch(request, data):
    
    try:
        try:
            q = request.args.get('q')
            if q:
                filtered_items=[]
                items=data['items']
                for item in items:
                    try:
                        found=False
                        metas=item['item-metadata']
                        for meta in metas:
                            if (meta['rel'] and re.search(q, meta['rel'])) or \
                               (meta['val'] and re.search(q, meta['val'])):
                                found=True
                        if found:
                            filtered_items.append(item)
                    except Exception as e:
                        print (e)
                        traceback.print_exc()
                data['items']=filtered_items
        except Exception as e:
            print (e)
            traceback.print_exc()

        try:
            rel = request.args.get('rel')
            val = request.args.get('val')
            if rel or val:
                filtered_items=[]
                items=data['items']
                for item in items:
                    try:
                        found=False
                        metas=item['item-metadata']
                        for meta in metas:
                            if (rel and meta['rel'] == rel) or \
                               (val and meta['val'] == val):
                                found=True
                        if found:
                            filtered_items.append(item)
                    except Exception as e:
                        print (e)
                        traceback.print_exc()
                data['items']=filtered_items
        except Exception as e:
            print (e)
            traceback.print_exc()
        
        try:
            prefixrel = request.args.get('prefixrel')
            prefixval = request.args.get('prefixval')
            prefixhref = request.args.get('prefixhref')
    
            if prefixrel or prefixval or prefixhref:
                filtered_items=[]
                items=data['items']
                for item in items:
                    try:
                        found=False
                        metas=item['item-metadata']
                        href=item['href']
                        for meta in metas:
                            if (prefixrel and meta['rel'].startsWith(prefixrel)) or \
                               (prefixval and meta['val'].startsWith(prefixval)):
                                found=True
                        
                        if href and re.search(href, prefixhref):
                            found=True
                            
                        if found:
                            filtered_items.append(item)
                    except Exception as e:
                        print (e)
                        traceback.print_exc()
                data['items']=filtered_items
        except Exception as e:
            print (e)
            traceback.print_exc()
        
        try:
            geobound_minlong = request.args.get('geobound-minlong')
            geobound_maxlong = request.args.get('geobound-maxlong')
            geobound_minlat = request.args.get('geobound-minlat')
            geobound_maxlat = request.args.get('geobound-maxlat')
            if geobound_minlong and geobound_minlat and geobound_maxlong and geobound_maxlat:
                filtered_items=[]
                items=data['items']
                for item in items:
                    try:
                        found=False
                        metas=item['item-metadata']
                        for meta in metas:
                            if meta['rel'] == "http://www.w3.org/2003/01/geo/wgs84_pos#lat":
                                if int(meta['val']) >= int(geobound_minlat) and \
                                   int(meta['val']) < int(geobound_maxlat):
                                    found=True
                            if meta['rel'] == "http://www.w3.org/2003/01/geo/wgs84_pos#long":
                                if int(meta['val']) >= int(geobound_minlong) and \
                                   int(meta['val']) < int(geobound_maxlong):
                                    found=True
                        if found:
                            filtered_items.append(item)
                    except Exception as e:
                        print (e)
                        traceback.print_exc()
                data['items']=filtered_items

        except Exception as e:
            print (e)
            traceback.print_exc()
        
        try:
            lexrange_rel = request.args.get('lexrange-rel')
            lexrange_min = request.args.get('lexrange-min')
            lexrange_max = request.args.get('lexrange-max')
            
            if lexrange_rel and lexrange_min and lexrange_max:
                print (lexrange_rel, lexrange_min, lexrange_max)
                filtered_items=[]
                items=data['items']
                for item in items:
                    try:
                        found=False
                        metas=item['item-metadata']
                        for meta in metas:
                            if meta['rel'] == lexrange_rel and meta['val'] >= lexrange_min and meta['val'] < lexrange_max:
                                found=True
                        if found:
                            filtered_items.append(item)
                    except Exception as e:
                        print (e)
                        traceback.print_exc()
                data['items']=filtered_items
        except Exception as e:
            print (e)
            traceback.print_exc()
        
        
    except Exception as e:
        print (e)
        traceback.print_exc()
    
    return data




app = Flask(__name__)


def doAuth(readOnly=False):
    auth=None
    
    try:
        auth_b64=request.headers.get('Authorization')
        #print(auth_b64)
        #print (base64.b64decode(auth_b64))
        if not auth_b64:
            return False, auth
        if auth_b64 and auth_b64.startswith('Basic '):
            auth_b64=auth_b64[5:]
            auth_b64 = base64.b64decode(auth_b64).decode("utf-8", "ignore").split(':')[0]
        auth_key=base64.b64decode(auth_b64).decode("utf-8", "ignore").split(':')[0]
        auth_key=base64.b64decode(auth_key).decode("utf-8", "ignore")


        auth_reg=re.compile('(\w+)[:=] ?"?(\w+)"?')
        auth=dict(auth_reg.findall(auth_key))
        
        auth['eth_contrib']=int(auth['eth_contrib'])
        auth['auth']=web3.toChecksumAddress(auth['auth'].lower());
        auth['api_key']=auth['api_key'].lower();
        
        if auth['eth_contrib'] > 0:
            #print (auth)
            #print (auth['auth'], auth['api_key'],  auth['eth_contrib'])
            status, key=authKey(auth['auth'], auth['api_key'])
            print('Auth Status',status, 'Key',key)
            if status:
                if not readOnly:
                    balance=web3.eth.getBalance(web3.toChecksumAddress(key.address))
                    if balance > int(auth['eth_contrib']):
                        to=web3.toChecksumAddress(address)
                        sender=web3.toChecksumAddress(auth['auth'])
                        userEthTransfer(auth['eth_contrib'], web3.toChecksumAddress(to), web3.toChecksumAddress(sender), '', auth)
            
                        return True, auth
                else:
                        auth['eth_contrib']=0
                        return True, auth
                    
    except Exception as e:
        print (e)
        traceback.print_exc()
        
    return False, auth

@app.route('/getSmartKey')
@app.route('/cat/getSmartKey')
def getUserSmartKey():
    address = request.args.get('address')
    if address:
        address=web3.toChecksumAddress(address);
    status, auth=doAuth(True)
    data = getSmartKey(address, auth)
    response = app.response_class(
        response=json.dumps(data, sort_keys=True, indent=4),
        status=200,
        mimetype='application/vnd.hypercat.catalogue+json'
    )
    return response

@app.route('/getSmartKeyTx')
@app.route('/cat/getSmartKeyTx')
def getUserSmartKeyTx():
    address = request.args.get('address')
    offset = request.args.get('offset')
    limit = request.args.get('limit')
    data={}
    try:
        if address:
            address=web3.toChecksumAddress(address);
        if offset:
            offset=int(offset)
        else:
            offset=0
        if limit:
            limit=int(limit)
        else:
            limit=10
        data = getSmartKeyTx(address, offset, limit)
    except Exception as e:
        print (e)
        traceback.print_exc()
    response = app.response_class(
        response=json.dumps(data, sort_keys=True, indent=4),
        status=200,
        mimetype='application/vnd.hypercat.catalogue+json'
    )
    return response

@app.route('/transferUserEth')
@app.route('/cat/transferUserEth')
def transferUserEth():
    address = request.args.get('address')
    beneficiary = request.args.get('beneficiary')
    amount = request.args.get('amount')
    if address:
        address=web3.toChecksumAddress(address);
    if beneficiary:
        beneficiary=web3.toChecksumAddress(beneficiary);
    api_key=''
    auth=''
    data={}
    status, auth=doAuth()
    if status: 
        
        key = userEthTransfer(amount, beneficiary, address, api_key, auth)
        data = getKeyInfo(key, auth)
    response = app.response_class(
        response=json.dumps(data, sort_keys=True, indent=4),
        status=200,
        mimetype='application/vnd.hypercat.catalogue+json'
    )
    return response


@app.route('/setUserHealth')
@app.route('/cat/setUserHealth')
def setUserHealthStatus():
    address = request.args.get('address')
    health = request.args.get('health')
    key=''
    auth=''
    health=int(health)
    status, auth=doAuth()
    data={}
    if status: 
        try:
            key = setUserHealth(health, web3.toChecksumAddress(address), key, auth)
            data = getKeyInfo(key, auth)
        except Exception as e:
            print (e)
            traceback.print_exc()
    response = app.response_class(
        response=json.dumps(data, sort_keys=True, indent=4),
        status=200,
        mimetype='application/vnd.hypercat.catalogue+json'
    )
    return response


@app.route('/post')
@app.route('/cat/post')
def create_node():
    data={}
    parent_href = request.args.get('parent_href')
    href = request.args.get('href')
    
    status, auth=doAuth()
    if status:    
            data=addNode(parent_href, href, auth, int(auth['eth_contrib']), True)
    
    response = app.response_class(
        response=json.dumps(data, sort_keys=True, indent=4),
        status=200,
        mimetype='application/vnd.hypercat.catalogue+json'
    )
    return response




@app.route('/get')
@app.route('/cat/get')
def get_node():
    data={}
    href = request.args.get('href')
    href=re.sub('\/$','',href);
    print("URL:",href)  
    if re.search('https:\/\/iotblock.io\/cat$',href):
        print("Root Node")
        data  =  getNode(root)
    else:
        node  =  getContract('GraphNode', network, root.call({'from':address}).getItem(href))
        data  =  getNode(node)
    
    try:
        data=metaSearch(request, data)       
    except Exception as e:
        print (e)
        traceback.print_exc()
    
    response = app.response_class(
            
        response=json.dumps(data, sort_keys=True, indent=4),
        status=200,
        mimetype='application/vnd.hypercat.catalogue+json'
        
    )
    return response

@app.route('/getBalance')
@app.route('/cat/getBalance')
def get_nodeBalance():
    data={}
    href = request.args.get('href')
    href=re.sub('\/$','',href);
    print("URL:",href)  
    if re.search('https:\/\/iotblock.io\/cat$',href):
        print("Root Node")
        data  =  getNodeBalance(root)
    else:
        node  =  getContract('GraphNode', network, root.call({'from':address}).getItem(href))
        data  =  getNodeBalance(node)
    
    try:
        data=metaSearch(request, data)       
    except Exception as e:
        print (e)
        traceback.print_exc()
    
    response = app.response_class(
            
        response=json.dumps(data, sort_keys=True, indent=4),
        status=200,
        mimetype='application/vnd.hypercat.catalogue+json'
        
    )
    return response


@app.route('/postNodeMetaData')
@app.route('/cat/postNodeMetaData')
def save_nodeMetaData():
    href = request.args.get('href')
    rel = request.args.get('rel')
    val = request.args.get('val')
    '''
    {
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
    data={}
    
    status, auth=doAuth()
    if status: 
        data=addNodeMetaData(href, rel, val,auth, auth['eth_contrib'])
        
    response = app.response_class(
        response=json.dumps(data, sort_keys=True, indent=4),
        status=200,
        mimetype='application/vnd.hypercat.catalogue+json'
    )
    return response


@app.route('/postNodeItemMetaData')
@app.route('/cat/postNodeItemMetaData')
def save_nodeItemMetaData():
    parent_href = request.args.get('parent_href')
    href = request.args.get('href')
    rel = request.args.get('rel')
    val = request.args.get('val')
    data={}
    status, auth=doAuth()
    if status: 
    
        #data['transactionId']=addNodeItemMetaData(node_href, item_href, rel, val, key,auth)
        data=addNodeItemMetaData(parent_href, href, rel, val, auth, auth['eth_contrib'])
    
    response = app.response_class(
        response=json.dumps(data, sort_keys=True, indent=4),
        status=200,
        mimetype='application/vnd.hypercat.catalogue+json'
    )
    return response


@app.route('/getNodeSmartKey')
@app.route('/cat/getNodeSmartKey')
def getNodeSmartKey():
    href = request.args.get('href')
    status, auth=doAuth(True)

    data = getNodeKey(href, auth)
    response = app.response_class(
        response=json.dumps(data, sort_keys=True, indent=4),
        status=200,
        mimetype='application/vnd.hypercat.catalogue+json'
    )
    return response

@app.route('/getNodeSmartKeyTx')
@app.route('/cat/getNodeSmartKeyTx')
def getNodeSmartKeyTx():
    href = request.args.get('href')
    offset = request.args.get('offset')
    limit = request.args.get('limit')
    data={}
    try:
        if offset:
            offset=int(offset)
        else:
            offset=0
        if limit:
            limit=int(limit)
        else:
            limit=10
        data = getNodeKeyTx(href, offset, limit)
    except Exception as e:
        print (e)
        traceback.print_exc()
    response = app.response_class(
        response=json.dumps(data, sort_keys=True, indent=4),
        status=200,
        mimetype='application/vnd.hypercat.catalogue+json'
    )
    return response

@app.route('/transferNodeEth')
@app.route('/cat/transferNodeEth')
def transferNodeEth():
    href = request.args.get('href')
    beneficiary = request.args.get('beneficiary')
    amount = request.args.get('amount')
    data={}
    status, auth=doAuth()
    if status: 
        data = nodeEthTransfer(amount, beneficiary, href, auth)
        
    response = app.response_class(
        response=json.dumps(data, sort_keys=True, indent=4),
        status=200,
        mimetype='application/vnd.hypercat.catalogue+json'
    )
    return response


@app.route('/setHealth')
@app.route('/cat/setHealth')
def setDeviceHealth():
    data={}
    href = request.args.get('href')
    health = request.args.get('health')
    status, auth=doAuth()
    if status:            
        health=int(health)
        key = setHealth(health, href, auth['eth_contrib'])
        data = getNodeKey(href, auth)
    response = app.response_class(
        response=json.dumps(data, sort_keys=True, indent=4),
        status=200,
        mimetype='application/vnd.hypercat.catalogue+json'
    )
    return response

@app.route("/events")
@app.route("/cat/events")
def subscribe():
    def consumeEthereumEvents():
        listener = smartKey.on('KeyEvent')
        while True:
          events = listener.get()
          if not events:
            time.sleep(1)
            continue
          for event in events:                             
            if re.search('NewCatalogue', event["args"]["transaction_name"]):
                data={}
                node  =  getContract('GraphNode', network, event["args"]["transacting_contract"])
                data  =  getNode(node)
                event["data"]=data
                
            if re.search('MetaDataUpdate', event["args"]["transaction_name"]):
                data={}
                node  =  getContract('GraphNode', network, event["args"]["key"])
                data  =  getNode(node)
                event["data"]=data

            if re.search('Deposit', event["args"]["transaction_name"]):
                data={}
                node  =  getContract('GraphNode', network, event["args"]["key"])
                data  =  getNode(node)
                event["data"]=data
                
            if re.search('Health', event["args"]["transaction_name"]):
                data={}
                node  =  getContract('GraphNode', network, event["args"]["key"])
                data  =  getNode(node)
                event["data"]=data
                
            url=""
            try:
                url=node.call().href()
                event["href"]=url;
            except Exception as e:
                print (e)
                traceback.print_exc()
            evt=json.dumps(event)
            evt=evt.replace('\u0000','')
                
            yield "id: %s\nevent: %s\ndata: %s\n\n" % (event["blockHash"], url, evt)
            
    def consumeKafka():
            consumer = KafkaConsumer(bootstrap_servers='localhost:9092',
                             auto_offset_reset='earliest',
                             consumer_timeout_ms=1000)
            consumer.subscribe(['KeyEvent'])
    
            while True:
                for message in consumer:
                    url="/cat/events"
                    try:
                        print(message.value)                    
                        msg=json.loads(message.value)
                        href=msg["href"]
                        if href:
                            url=href
                    except Exception as e:
                        print (e)
                        traceback.print_exc()
                    yield "id: %s\nevent: %s\ndata: %s\n\n" % (message.offset,url, message.value)
                    
            consumer.close()

    return Response(consumeKafka(), mimetype="text/event-stream")


@app.route('/', defaults={'path': ''},  methods = ['GET', 'POST', 'DELETE'])
@app.route('/<path:path>',  methods = ['GET', 'POST', 'DELETE'])
def catch_all(path):
    appendData=''
    try:
        if request.method == 'POST':
            print(request.method)
            if request.data:
                print (request.data)
                print (path)
                data=json.loads(request.data)
                if type(data).__name__ == 'str':
                    data=json.loads(data);                
                status, auth=doAuth()
                print(data)

                if data and status: 
                    path=re.sub('\/$','',path);
                    href  =  rootNode + path
                    rootHref=href;
                    for key, value in data.items():
                        print (key)

                        if key == 'catalogue-metadata':
                            for item in value:
                                print(item);
                                if 'rel' in item and 'val' in item:
                                    data=addNodeMetaData(href, item['rel'], item['val'], auth, auth['eth_contrib'], rootNode + 'cat')
                        if key == 'items':
                            for item in value:
                                print(item);
                                href=item['href']
                                if 'item-metadata' in item:
                                    metadata=item['item-metadata']
                                    for meta in metadata:
                                        if 'rel' in meta and 'val' in meta:
                                            data=addNodeMetaData(href, meta['rel'], meta['val'], auth, auth['eth_contrib'], rootHref)
                                if 'items' in item:
                                    subitems=item['items']
                                    for subitem in subitems:
                                        subhref=subitem['href']
                                        submetadata=subitem['item-metadata']
                                        for submeta in submetadata:
                                            if 'rel' in submeta and 'val' in submeta:
                                                data=addNodeMetaData(subhref, submeta['rel'], submeta['val'], auth, auth['eth_contrib'], href)
                    response = app.response_class(
            
                        response='Created',
                        status=200,
                        #mimetype='application/vnd.hypercat.catalogue+json'
                        
                    )
                    return response
    except Exception as e:
        print (e)
        traceback.print_exc()
    '''
    {
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
    path=re.sub('\/$','',path);
    if path   == 'cat':
        href = rootNode + 'cat';
        data  =  getNode(root)
    else:
        href  =  rootNode + path
        node  =  getContract('GraphNode', network, root.call({'from':address}).getItem(href))
        data  =  getNode(node)
    
    
    '''
    ?rel=urn:X­hypercat:rels:1
    ?rel=urn:X­hypercat:rels:2
    ?rel=urn:X­hypercat:rels:3
    ?val=1
    ?val=2
    ?val=
    ?rel=urn:X­hypercat:rels:1&val=1
    ?rel=urn:X­hypercat:rels:3&val=
    '''
    
    try:
        data=metaSearch(request, data)       
    except Exception as e:
        print (e)
        traceback.print_exc()

    response = app.response_class(
            
        response=json.dumps(data, sort_keys=True, indent=4),
        status=200,
        mimetype='application/vnd.hypercat.catalogue+json'
        
    )
    return response


if __name__ == '__main__':
    app.run(debug=True, port=8888)
    #app.debug = True
    #server = WSGIServer(("", 8888), app)
    #server.serve_forever()






