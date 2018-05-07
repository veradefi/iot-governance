# -*- coding: utf-8 -*-
import threading, logging, time
import multiprocessing
from kafka import KafkaConsumer, KafkaProducer
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
from time import sleep
from datetime import datetime
import base64
import threading
#from flask import Flask


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
address=web3.eth.accounts[0]

print (address, address2)
gc=getContract('SmartKey',network)
io=getContract('PublicOffering',network)
root=getContract('GraphRoot',network)
smartNode=getContract('SmartNode',network)
smartKey=getContract('SmartKey',network)
# do something....

'''

GET /cat/events
Client recieves an item update event for item http://example.org/item

id: 14:23:51
event: http://example.org/item
data:
{"href":"http://example.org/item","item­metadata":[{"rel":"urn:X­
hypercat:rels:hasDescription:en","val":"thing"},{"rel":"...","val
":"..."},{"rel":"...","val":"..."}]}
    
Client recieves an item deletion event for item http://example.org/item

id: 14:23:51
event: http://example.org/item
data:
    
'''

class Producer(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.stop_event = threading.Event()
        
    def stop(self):
        self.stop_event.set()

    def run(self):
        producer = KafkaProducer(bootstrap_servers='localhost:9092')

        listener = root.on('NewCatalogue')
        while not self.stop_event.is_set():
          events = listener.get()
          if not events:
            time.sleep(1)
            continue
          for event in events:                             
            '''
            {'blockHash': u'0xad8be74664e83aaa68fe829ff8736c07a2b638bc81f6095529ab90ecf656e040', 
            'transactionHash': u'0xca677383bd6a3db11ceb8e0a2c375170844cc406c5f373f214276904c955b67a', 
            'args': {u'href': u'https://iotblock.io/cat/location/earth/singapore/changee/airport', 
            u'user': u'0xdC36bf9327f714B7e3dEA4E368A23B6850a64394', 
            u'parentNode': u'0x7725D50411054e1027863363F6e8d6bf8B7ae499', 
            u'childNode': u'0xb9cb9645272e4Aa25b3d2B0e5fE577f1Cc7AcF35'}, 
            'blockNumber': 173, 
            'address': u'0x7725D50411054e1027863363F6e8d6bf8B7ae499', 'logIndex': 18, 'transactionIndex': 0, 'event': u'NewCatalogue'}
            '''
            producer.send('Catalogue', json.dumps(event))
            print(event)
          time.sleep(1)

        producer.close()

class Consumer(multiprocessing.Process):
    def __init__(self):
        multiprocessing.Process.__init__(self)
        self.stop_event = multiprocessing.Event()
        
    def stop(self):
        self.stop_event.set()
        
    def run(self):
        consumer = KafkaConsumer(bootstrap_servers='localhost:9092',
                                 auto_offset_reset='earliest',
                                 consumer_timeout_ms=1000)
        consumer.subscribe(['Catalogue'])

        while not self.stop_event.is_set():
            for message in consumer:
                print(message)
                if self.stop_event.is_set():
                    break

        consumer.close()
        
        
def main():
    tasks = [
        Producer(),
        Consumer()
    ]

    for t in tasks:
        t.start()

    while True:
        time.sleep(10)
    
    for task in tasks:
        task.stop()

    for task in tasks:
        task.join()
        
        
if __name__ == "__main__":
    logging.basicConfig(
        format='%(asctime)s.%(msecs)s:%(name)s:%(thread)d:%(levelname)s:%(process)d:%(message)s',
        level=logging.INFO
        )
    main()
