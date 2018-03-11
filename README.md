#IOTBLOCK
=============

https://iotblock.io/rpc
--------
Ethereum Ganache RPC

        npm install
        ganache-cli --network-id 5

IoTBlock Ethereum Smart Contracts (/contracts)

        sh build.sh
        python test_hypercat.py
        python test_smartkey.py
        python test_ico.py


https://iotblock.io/icat 		
--------
Web3 Browser Smart Contract Client (/app)
	
	sh build_web.sh

NodeJS iCat web server + HTTP proxy 

	node server/web.mjs

https://iotblock.io/cat
--------
Python RESTful /cat web server + HTTP proxy
	
	python server/index.py

https://iotblock.io/icatOS
--------
NodeJS iCat Admin Tools

	cd server/browser-tools
	npm install
	npm start


Key Sign Tools
--------
	
	node server/keySign.js 
	python server/keySign.py

