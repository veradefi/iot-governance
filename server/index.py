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
smartKey=getContract('SmartKey',network)




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
    
def getNodeKey(href):
    try:
        href=re.sub('\/$','',href)
        if re.search('/cat$',href):
            graphRoot=root
        else:
            graphRoot=getContract('GraphNode', network, root.call({'from':address}).getGraphNode(href))
    except Exception as e:
        print (e)

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
        
    cat = { 
            "address":graphRoot.address,
            "eth_recv":amount,
            "balance":balance,
            "state":state,
            "health":health,
            "tokens":tokens,
            #"transactions":transactions,
            "vault":vault,
            
            }
    
    return cat

def getNodeKeyTx(href):
    try:
        href=re.sub('\/$','',href)
        if re.search('/cat$',href):
            graphRoot=root
        else:
            graphRoot=getContract('GraphNode', network, root.call({'from':address}).getGraphNode(href))
    except Exception as e:
        print (e)

    key=getContract('Key',network, graphRoot.address, prefix="pki_")

    tx=[]
    try:
        hasHistory=True
        idx=0
        while hasHistory:
            transactions=key.call({'from':address}).transactions(key.address,idx)
            sender=transactions[0]
            date=transactions[1]
            amount=transactions[2]
            if sender != '0x0' and sender != re.search('0x0000000000000000000000000000000000000000',sender):
                tx.append({'sender':sender,'date':date,'amount':amount})
                idx+=1
    except Exception as e:
        print (e)
        
    cat = { 
            "transactions":tx
               
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

    metaJson=[]
    itemJson=[]
    
    try:
        
        metaJson=getMeta(graphRoot.call({'from':address}).selectMetaData()) 
        itemJson=getItem(graphRoot.call({'from':address}).selectItems())
        
    except Exception as e:
        print (e)
        
    cat = { 
            "catalogue-metadata":metaJson,
            "items":itemJson
          }
    
    return cat






def addNode(parent_href, href, key, auth, load):
    if href:
        
        if parent_href: 
            
            try:
                parent_href=re.sub('\/$','',parent_href)
                if re.search('/cat$',parent_href):
                    graphRoot=root
                else:
                    graphRoot=getContract('GraphNode', network, root.call({'from':address}).getGraphNode(parent_href))
            except Exception as e:
                print (e)
            print (parent_href, href, address, graphRoot.address, root.address)
            print ('upsertNode', smartNode.transact({ 'from': address, 'value':2 }).upsertNode(graphRoot.address, href))
            graphRoot=getContract('GraphNode', network, root.call({'from':address}).getGraphNode(href))
            
            
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



def addItemData(parent_href, href, key, auth, load):
    data={}
    
    if href:
        addNode(parent_href, href, key, auth, load)
        if parent_href: 
            
            try:
                parent_href=re.sub('\/$','',parent_href)
                if re.search('/cat$',parent_href):
                    graphRoot=root
                else:
                    graphRoot=getContract('GraphNode', network, root.call({'from':address}).getGraphNode(parent_href))
            except Exception as e:
                print (e)
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



def addNodeMetaData(node_href,rel, val,key=None,auth=None):
    if node_href: 
        
        try:
            node_href=re.sub('\/$','',node_href)
            if re.search('/cat$',node_href):
                graphRoot=root
            else:
                graphRoot=getContract('GraphNode', network, root.call({'from':address}).getGraphNode(node_href))
        except Exception as e:
            print (e)
    transactionId=graphRoot.transact({ 'from': address, 'value':2 }).upsertMetaData(rel,val)
    print ('upsertMetaData',transactionId)
    
    data={}
    data= getNode(graphRoot)
    
    return data




def addNodeItemMetaData(node_href, href, rel, val, key = None,auth = None):
    transactionId=''
    if node_href and href:
        if node_href: 
            
            try:
                node_href=re.sub('\/$','',node_href)
                if re.search('/cat$',node_href):
                    graphRoot=root
                    print ("is Root Node")
                else:
                    graphRoot=getContract('GraphNode', network, root.call({'from':address}).getGraphNode(node_href))
            except Exception as e:
                print (e)
        else:
            graphRoot=root
        print(node_href, href, graphRoot.call({'from':address}).getItem(href))
        item_c=getContract('CatalogueItem',network, graphRoot.call({'from':address}).getItem(href))   
        transactionId=item_c.transact({ 'from': address, 'value':2 }).upsertMetaData(rel,val)
        print ('upsertMetaData',transactionId)
        
    data={}
    data= getNode(graphRoot)
    
    return data


def nodeEthTransfer(amount, beneficiary, href, key=None,auth=None):
    amount=int(amount)
    if href: 
        
        try:
            href=re.sub('\/$','',href)
            if re.search('/cat$',href):
                graphRoot=root
            else:
                graphRoot=getContract('GraphNode', network, root.call({'from':address}).getGraphNode(href))
        except Exception as e:
            print (e)
            
    print('transferEth',graphRoot.transact({ 'from': address }).transferEth(amount, beneficiary));
        
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
        
    cat = { 
            "address":graphRoot.address,
            "eth_recv":amount,
            "balance":balance,
            "state":state,
            "health":health,
            "tokens":tokens,
            #"transactions":transactions,
            "vault":vault,
            
            }
    
    return cat


def setHealth(health, href, key=None,auth=None):
    health=int(health)
    if href: 
        
        try:
            href=re.sub('\/$','',href)
            if re.search('/cat$',href):
                graphRoot=root
            else:
                graphRoot=getContract('GraphNode', network, root.call({'from':address}).getGraphNode(href))
        except Exception as e:
            print (e)
    
     
    print('transferEth',graphRoot.transact({ 'from': address }).setHealth(health))
        
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
        
    cat = { 
            "address":graphRoot.address,
            "eth_recv":amount,
            "balance":balance,
            "state":state,
            "health":health,
            "tokens":tokens,
            #"transactions":transactions,
            "vault":vault,
            
            }
    
    return cat



app = Flask(__name__)




@app.route('/post')
@app.route('/cat/post')
def create_node():
    parent_href = request.args.get('parent_href')
    href = request.args.get('href')
    key = request.args.get('key')
    auth = request.args.get('auth')
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
    auth=''
    val=2
    data=addItemData(parent_href, href, key, auth, val)
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
    key = request.args.get('key')
    auth = request.args.get('auth')
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
    auth=''
    
    data=addNodeMetaData(href, rel, val,key,auth)
    response = app.response_class(
        response=json.dumps(data, sort_keys=True, indent=4),
        status=200,
        mimetype='application/vnd.hypercat.catalogue+json'
    )
    return response



@app.route('/postNodeItemMetaData')
@app.route('/cat/postNodeItemMetaData')
def save_nodeItemMetaData():
    node_href = request.args.get('node_href')
    item_href = request.args.get('item_href')
    key = request.args.get('key')
    auth = request.args.get('auth')
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
    auth=''
    
    data={}
    #data['transactionId']=addNodeItemMetaData(node_href, item_href, rel, val, key,auth)
    data=addNodeItemMetaData(node_href, item_href, rel, val, key,auth)
    
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
    data = getNodeKey(href)
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
    data = getNodeKeyTx(href)
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
    key=''
    auth=''
    data = nodeEthTransfer(amount, beneficiary, href, key, auth)
    response = app.response_class(
        response=json.dumps(data, sort_keys=True, indent=4),
        status=200,
        mimetype='application/vnd.hypercat.catalogue+json'
    )
    return response


@app.route('/setHealth')
@app.route('/cat/setHealth')
def setDeviceHealth():
    href = request.args.get('href')
    health = request.args.get('health')
    key=''
    auth=''
    health=int(health)
    data = setHealth(health, href, key, auth)
    response = app.response_class(
        response=json.dumps(data, sort_keys=True, indent=4),
        status=200,
        mimetype='application/vnd.hypercat.catalogue+json'
    )
    return response


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
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
        data  =  getNode(root)
    else:
        href  =  "https://iotblock.io/" + path
        node  =  getContract('GraphNode', network, root.call({'from':address}).getGraphNode(href))
        data  =  getNode(node)
    
    response = app.response_class(
            
        response=json.dumps(data, sort_keys=True, indent=4),
        status=200,
        mimetype='application/vnd.hypercat.catalogue+json'
        
    )
    return response






if __name__ == '__main__':
    app.run(debug=True, port=8888)






