import json
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
from gevent.queue import Queue
import threading, logging, time
import multiprocessing
from kafka import KafkaConsumer, KafkaProducer

network='4'
port='8666'
#web3 = Web3(KeepAliveRPCProvider(host='localhost', port=port))
web3 = Web3(HTTPProvider('https://rinkeby.infura.io/8BNRVVlo2wy7YaOLcKCR'))

print (web3.personal.newAccount('the-passphrase'))
