.. _install-label:

Installation
********

******************
The Universal IoT Blockchain Smart Contracts
******************

TestRPC
--------
Ethereum Ganache RPC

::
        
        npm install
        ganache-cli --network-id 5

IoTBlock Ethereum Smart Contracts (/contracts)

::

        sh build.sh
        python test_hypercat.py
        python test_smartkey.py
        python test_ico.py

Rinkeby
--------
Ethereum Rinkeby RPC

::

        sh rpc_rinkeby.sh

IoTBlock Ethereum Smart Contracts (/contracts)

::

        sh build_rinkeby.sh
        sh build_rinkeby_data.sh
        



******************
The Universal IoT Blockchain Web Interface
******************

https://iotblock.io/icatOS
--------
NodeJS iCat Admin Tools

::

	cd server/browser-tools
	npm install
	npm start


******************
The Universal IoT Blockchain Hypercat API
******************

https://iotblock.io/cat
--------
Python RESTful /cat web server + HTTP proxy


::
	
    python server/index.py
    
    


