.. _smartcontract-label:

Smart Contract
******

The primary entities storing IotBlock Data in Blockchain are individual Smart Contracts deployed on Ethereum network stored decentrally, collectively called The Universal IoT Blockchain Database.

Typically you will use the Ethereum Client (e.g. Web3) to access the IoTBlock Smart Contracts. Each mutating transaction involves gas and an ETH donation, which are shared between Catalgue Creators and IoTBlock on 50/50 basis.


******************
Smart Key Smart Contract (SmartKey.sol)
******************


::
    
    pragma solidity ^0.4.18;
    
    import "./pki/Key.sol";
    import "./token/MintableToken.sol";
    import "./math/SafeMath.sol";
    
    contract SmartKey is MintableToken 
    {
    
        using SafeMath for uint256;    
        string public name;                                       //name
        uint8  public decimals;                                   //There could 1000 base units with 3 decimals. 
        string public symbol;                     
        string public version = 'IoTBlock_Smart_Key_0.01';       // version
        address vault;
    
        event IssueSmartKey(address indexed user, address indexed key);
        event ActivateSmartKey(address indexed user, address indexed key);
            
        mapping (address => Key) public  smartKeys;
        
        function SmartKey(uint256 _tokens, uint256 _rate, address[] adminAddress) 
        Administered(adminAddress)
        MintableToken(_rate)
        public
        {
        
            admins  = adminAddress;    
            vault  = admins[0];
            mint(vault, _tokens);        
            
            name = 'IOTBLOCK';                               // Set the name for display purposes
            decimals = 8;
            symbol = 'IOTBLOCK';                       
            
        }
        
        function setVault(address _vault) 
        onlyAdmin 
        public
        returns (bool) {
            vault=_vault;
            return true;                
        }
        
        
      
        function getBalanceInEth(address addr) 	
        public
        view
        returns(uint)
        {
        
    		return convertToWei( balances[addr] );
    		
    	}
    
        function getBalance(address addr) 
    	public
        view
        returns(uint) 
        {
    		return (balances[addr]);
        }
    		    
        // @return true if the transaction can buy tokens
        function validPurchase() internal constant returns (bool) 
        {
            bool nonZeroPurchase = msg.value != 0;
            return nonZeroPurchase;
        }
    
        // fallback function can be used to buy tokens
        function () 
        public
        payable 
        {
            addSmartKey(msg.sender);
        }
    
        
        function addSmartKey(address beneficiary) 
        public
        payable 
        returns(address) 
        {
            require(beneficiary != 0x0);
            require(validPurchase());
            
            // calculate token amount to be created
            uint256 tokens = convertToToken(msg.value);
    
            if (msg.value > 10000000000000) {
                Key key;
                if (smartKeys[beneficiary] == address(0)) 
                {
                    key = new Key(beneficiary); 
                    smartKeys[beneficiary] = key;
                    IssueSmartKey(beneficiary, key);
                }
                else 
                {
                    key = smartKeys[beneficiary];
                }
    
                key.activateKey.value(msg.value)(address(key));
                key.addOwner(address(this));
                //key.activateKey(beneficiary);
                
                ActivateSmartKey(beneficiary, key); 
                
                tokenMinted = tokenMinted.add(tokens);
                
                balances[address(key)] = balances[address(key)].add(tokens);
                Mint(address(key), tokens);
                Transfer(address(0), address(key), tokens);
                return address(key);
            }        
            
            return 0x0;
        }
        
        function putSmartKey(Key key, address beneficiary) 
        onlyAdmin
        public
        {
            require(beneficiary != 0x0);
            
            if (smartKeys[beneficiary] == address(0)) 
            {
                smartKeys[beneficiary] = key;
            }
            
        }
        
        function addOwner(address _user) 
        onlyAdmin
        public
        {
            require(_user != 0x0);
            require(smartKeys[_user] != address(0));
            smartKeys[_user].addOwner(msg.sender);
        }
        
     
       function transferEth(uint amount, address sender, address beneficiary) 
       public
       {
            require(sender != 0x0);
            require(beneficiary != 0x0);
            require(smartKeys[sender] != address(0));
            if (isAdmin[msg.sender] || smartKeys[sender].isOwner(msg.sender)) {
                smartKeys[sender].transferEth(amount, beneficiary);
            }
       }
    
        function getSmartKey(address user) 	
        public
        view
        returns (Key) 
        {    
            
            return smartKeys[user];
            
        }
            
        function convertToWei(uint256 amount) 
        public
        view
        returns (uint256) 
        {
    		return amount.mul(rate);
        }
    
        function convertToToken(uint256 amount) 
        public
        view
        returns (uint256) 
        {
    		return amount.div(rate);
        }
    
    }

.. index:: ! visibility, external, public, private, internal

getSmartKey(address user) 
=============

transferEth(uint amount, address sender, address beneficiary) 
=============

******************
Catalogue Smart Contract (Catalogue.sol)
******************

::

    pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

    import "./NodeMetaData.sol";
    
    contract Catalogue is NodeMetaData {
           
      // PAS212:216
      string public href;
      address[] public items;  
      // MetaData[] meta; // inherited from NodeMetaData
      // PAS212:216
      
      mapping (bytes32 => address) public nodeData; 
     
      //event CatItemDataUpdate(address indexed user, address indexed catItem);
    
      function Catalogue(SmartKey _smartKey, address[] _adminAddress) 
      public
      NodeMetaData(_smartKey, _adminAddress) 
      {
      }
      
      function selectItems() 
      constant
      public
      returns (address[]) 
      {
             return items;
      }
      
      function selectHref() 
      constant
      public
      returns (bytes) 
      {
             return bytes(href);
      }
    
      function setHref(string _href) 
      public
      payable
      returns (bool)
      {
          SmartKey(smartKey).addSmartKey.value(msg.value)(address(this));
          
          href=_href;
          return true;      
      }
    
    }

   
******************
Graph Node Smart Contract (GraphNode.sol)
******************


::
    
    pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use
    
    import "./Catalogue.sol";
    
    contract GraphNode is Catalogue, Key {
     
      function GraphNode(SmartKey _smartKey, address[] adminAddress) 
      public
      Catalogue(_smartKey, adminAddress)
      Key(address(this))
      {      
          
          for (uint i=0; i < adminAddress.length; i++) {
            addOwner(adminAddress[i]);
             
          } 
          addOwner(address(_smartKey));
         
      }
      
      function upsertItem(GraphNode _node, string _href)
      public
      payable
      returns (bool)
      {  
          smartKey.addSmartKey.value(msg.value)(address(this));
    
          bytes32 hashVal=getHash(_href);
          
          if (nodeData[hashVal] == address(0)) 
          {
          
                nodeData[hashVal]=address(_node);
                items.push(address(_node));
                _node.setHref.value(msg.value)(_href);
          }
          
          return true;
          
      }
      
      function getItem(string _href) 
      constant
      public
      returns (address) 
      {      
          bytes32 hashVal=getHash(_href);
          
          if (nodeData[hashVal] != address(0)) 
          {
             return nodeData[hashVal];
          }
    
          if (bytes(_href).length < 1)
          {
              return this;
          }
          
          return 0x0;
          
      }
        
    }

.. index:: ! visibility, external, public, private, internal