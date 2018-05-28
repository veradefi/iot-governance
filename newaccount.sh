geth --datadir accounts/ account new
geth --datadir accounts/ console
personal.unlockAccount(eth.accounts[0], 'password', 0)
#echo "web3.personal.newAccount('verystrongpassword')" | truffle console
