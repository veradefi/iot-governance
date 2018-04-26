.. _install-label:

Installation
**********************************************************

******************************************************************
Github Source Code
******************************************************************

All components of this project, including The Universal IoT Blockchain Database, Hypercat API, and Hypercat Web Interface are open-source to allow community contribution and participation, to join in on our mission to Bring Governance to Technology using Blockchain.

We encourage contribution to the open-source development efforts of this project, which is available at <https://github.com/iotblock/iotblock>

Accessing the Source Code Repository:

::
    
    git clone https://github.com/iotblock/iotblock
    
    

******************************************************************
The Universal IoT Blockchain Database Smart Contracts
******************************************************************

TestRPC
------------------------------------------------------------------
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
------------------------------------------------------------------

Ethereum Rinkeby RPC

::

        sh rpc_rinkeby.sh

IoTBlock Ethereum Smart Contracts (/contracts)

::

        sh build_rinkeby.sh
        sh build_rinkeby_data.sh
        


******************************************************************
The Universal IoT Blockchain Web Interface
******************************************************************

Web Interface to access the The Universal IoT Blockchain Hypercat API and The Universal IoT Blockchain Smart Contracts


::

	cd server/browser-tools
	npm install
	npm start

IoTBlock's Web Interface is accessible via <https://iotblock.io/icatOS>


******************************************************************
The Universal IoT Blockchain Hypercat API
******************************************************************

The Universal IoT Blockchain Hypercat API to access The Universal IoT Blockchain Smart Contracts

::
	
    python server/index.py
    
IoTBlock's Hypercat API is accessible via <https://iotblock.io/cat>



