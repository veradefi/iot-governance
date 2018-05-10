.. _smartcontract-label:

Smart Contracts
************************************************



******************************************************
The Universal IoT Blockchain Database Smart Contracts
******************************************************

The primary entities storing IotBlock Data in Blockchain are individual Smart Contracts deployed on Ethereum network stored decentrally, collectively called The Universal IoT Blockchain Database.

Typically you will use the Ethereum Client (e.g. Web3) to access the IoTBlock Smart Contracts. Each mutating transaction involves gas and an ETH donation, which are shared between Catalogue Creators and IoTBlock on 50/50 basis.




******************************************************
Smart Key Smart Contract (SmartKey.sol)
******************************************************


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
        string public version = 'IoTBlock_SmartKey_0.01';       // version
        address vault;
    
        event KeyEvent(address user, address key, address beneficiary, uint256 eth_amount, bytes32 transaction_name, bytes32 health_status);
        
        mapping (address => Key) public  smartKeys;
    
        struct event_transaction {
            
            address account;
            uint256 date;
            uint256 amount;
            
            uint256 transaction_type;
            
            bytes32 transaction_name;
            bytes32 health_status;
            
        }
        
        mapping (address => event_transaction[]) public events;
        
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
            return msg.value > 1000000000;
        }
    
        // fallback function can be used to buy tokens
        function () 
        public
        payable 
        {
            loadSmartKey(getSmartKey(msg.sender), address(this), 'Deposit');
        }
        
        function getSmartKey(address beneficiary) 	
        public
        view
        returns (Key) 
        { 
          
            return smartKeys[beneficiary];
            
        }
    
        function loadSmartKey(Key key, address beneficiary,  bytes32 transaction_name) 
        public
        payable 
        returns(bool) 
        {
                //require(address(key) != address(0));
                require(validPurchase());
                
                if (address(key) == address(0) && smartKeys[beneficiary] == address(0)) 
                {
                    key = new Key(this, beneficiary); 
                    smartKeys[beneficiary]=key;
                }
                
                uint256 token=convertToToken(msg.value);            
                bytes32 healthStatus=key.getHealthStatus();
                
                KeyEvent(msg.sender, address(key), beneficiary, msg.value, transaction_name, healthStatus);
                events[address(key)].push(event_transaction(beneficiary,now,msg.value, 0, transaction_name, healthStatus));            
                tokenMinted = tokenMinted.add(token);
                balances[address(beneficiary)] = balances[address(beneficiary)].add(token);
                Transfer(address(0), address(beneficiary), token);
       
                key.activateKey.value(msg.value)(address(beneficiary));
                
                return true;
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
    
            
        function convertToToken(uint256 amount) 
        public
        view
        returns (uint256) 
        {
    		return amount.div(rate);
        }
    
    }

.. index:: ! visibility, external, public, private, internal



loadSmartKey(Key key, address beneficiary,  bytes32 transaction_name) public payable returns(bool) 
==============================================================================

.. js:function:: loadSmartKey(Key key, address beneficiary,  bytes32 transaction_name) public payable returns(bool) 

   :param Key key: Identification Key of the user
   :param address beneficiary: Ethereum Address of the user
   :param bytes32 transacton_name: Purpose of ETH Donation
   :returns: The Smart Key address of the User
   :rtype: Key address



getSmartKey(address user) 
==============================================================================

.. js:function:: getSmartKey(address user) 

   :param address user: Ethereum Address of the user
   :returns: The Smart Key of the User
   :rtype: Key

transferEth(uint amount, address sender, address beneficiary) public
==============================================================================

.. js:function:: transferEth(uint amount, address sender, address beneficiary) public

   :param uint amount: Amount of Wei to transfer
   :param address sender: Ethereum Address of the sender
   :param address beneficiary: Ethereum Address of the beneficiary

******************************************************
Key Smart Contract (Key.sol)
******************************************************

::

    pragma solidity ^0.4.18;
    
    import '../math/SafeMath.sol';
    import '../ownership/Ownable.sol';
    import '../SmartKey.sol';
    
    contract Key is Ownable {
       
       using SafeMath for uint256;
        
       enum State { Issued, Active, Returned }
       //event KeyStateUpdate(address indexed beneficiary, address indexed vault, State status);
        
       enum Health { Provisioning, Certified, Modified, Compromised, Malfunctioning, Harmful, Counterfeit }
       event HealthUpdate(Health status);
    
       SmartKey public smartKey;
       address public vault;
       State public state;
       Health public health;
       uint256 public contrib_amount;
       mapping (address => uint256) public activated;
    
       struct transaction {
            
            address account;
            uint256 date;
            uint256 amount;
            
            uint256 transaction_type;
            
       }
        
       mapping (address => transaction[]) public transactions;
    
       function Key(SmartKey _smartKey, address _vault) 
       public
       {
            require(_vault != 0x0);
            vault = _vault;
            smartKey=_smartKey;
            state = State.Issued;
            isOwner[_vault]=true;
            isOwner[address(_smartKey)]=true;
            //KeyStateUpdate(msg.sender, vault, state);
       }
    
       function getTransactionCount(address _address) 
       view
       public
       returns (uint256)
       {
           return transactions[_address].length;
       }
    
       function transferEth(uint amount, address beneficiary) 
       public
       onlyOwner 
       {
            require(state == State.Active);
            beneficiary.transfer(amount);
            transactions[address(this)].push(transaction(beneficiary,now,amount, 1));
       }
       
       function setHealth(Health _health) 
       public
       payable
       {
       
            if (msg.value > 10000000000000) {
                health = _health;
                
                if (uint256(_health) > 1) {
                    smartKey.loadSmartKey.value(msg.value)(this, address(this), bytes32('HealthWarning'));
                    
                } else {
                    smartKey.loadSmartKey.value(msg.value)(this, address(this), bytes32('HealthUpdate'));
                    
                }
                HealthUpdate(_health);
                            
                contrib_amount=contrib_amount.add(msg.value);    
                transactions[address(this)].push(transaction(msg.sender,now,msg.value, 0));
                //activated[msg.sender] = activated[msg.sender].add(msg.value);     
                //if (vault != address(this) && vault != address(msg.sender)) {
                //    vault.transfer(msg.value);
                //}
            }
       
       }
       
       function getHealth() 
       view
       public
       returns (Health)
       {
            
            return health;   
       }
       
       function getHealthStatus()
       view 
       public 
       returns (bytes32)
       {
           if (health == Health.Provisioning) 
               return 'Provisioning';
           else if (health == Health.Certified) 
               return 'Certified';
           else if (health == Health.Modified) 
               return 'Modified';
           else if (health == Health.Compromised) 
               return 'Compromised';
           else if (health == Health.Malfunctioning) 
               return 'Malfunctioning';
           else if (health == Health.Harmful) 
               return 'Harmful';
           else if (health == Health.Counterfeit) 
               return 'Counterfeit';
    
           return 'Counterfeit';
    
       }
       
       function activateKey(address user) 
       public
       payable
       {
    
            state = State.Active;
            //activated[msg.sender] = activated[msg.sender].add(msg.value);     
            contrib_amount=contrib_amount.add(msg.value);    
            transactions[user].push(transaction(msg.sender,now,msg.value, 0));
       }
    
        
       function returnKey() 
       public
       onlyOwner 
       {
            require(state == State.Active);
            state = State.Returned;
       }
       
       function getHash(string key) 
       pure
       public
       returns(bytes32) {
            return keccak256(key);
       }
    
       mapping(bytes32 => string) private map;
    
       function addKeyValueByHash(bytes32 hash, string value) 
       onlyOwner
       public
       returns(bool)
       {
            //if(bytes(map[hash]).length != 0) { // Don't overwrite previous mappings and return false
            //    return false;
            //}
            map[hash] = value;
            return true;
       }
    
       function getValueByHash(bytes32 hash) 
       onlyOwner
       constant    
       public
       returns(string) 
       {
            return map[hash];
       }
    
       function addKeyAuth(string key, string value) 
       onlyOwner
       public
       returns(bool)
       {
            return addKeyValueByHash(keccak256(key), value);
       }
    
       function getKeyAuth(string key) 
       onlyOwner
       constant 
       public
       returns(string)
       {
            return getValueByHash(keccak256(key));
       }
       
       function () 
       public
       payable 
       {
            activateKey(msg.sender);
       }
       
    }


getHealth() view public returns (Health)
==============================================================================

.. js:function:: getHealth() view public returns (Health)

   :returns: Health of the Catalogue
   :rtype: enum Health { Provisioning, Certified, Modified, Compromised, Malfunctioning, Harmful, Counterfeit }

   
setHealth(Health _health) public payable
==============================================================================

.. js:function:: setHealth(Health _health) public payable

   :param _health: Health Status specified as integer between 0-6. 
   :type _health: enum Health { Provisioning, Certified, Modified, Compromised, Malfunctioning, Harmful, Counterfeit }
   
addKeyAuth(string key, string value) onlyOwner public returns(bool)
==============================================================================

.. js:function:: addKeyAuth(string key, string value) onlyOwner public returns(bool)

   :param string key: Authorization Key String to associate with Value
   :param string value: Authorization Value String to associate with Key
   :returns: True if successfully added, False if error
   :rtype: bool
   
getKeyAuth(string key) onlyOwner constant public returns(string)
==============================================================================
.. js:function:: getKeyAuth(string key) onlyOwner constant public returns(string)

   :param string key: Authorization Key String 
   :returns: Authorization Value String associated with the Key
   :rtype: string

transferEth(uint amount, address beneficiary) public onlyOwner 
==============================================================================

.. js:function:: transferEth(uint amount, address beneficiary) public

   :param address sender: Ethereum Address of the sender
   :param address beneficiary: Ethereum Address of the beneficiarys

   
******************************************************
Catalogue Smart Contract (Catalogue.sol)
******************************************************

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
    
      function setHref(string _href) 
      public
      onlyAdmin
      returns (bool)
      {
          
          href=_href;
          return true;      
      }
    
    }

******************************************************
Graph Node Smart Contract (GraphNode.sol)
******************************************************


::
    
    pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use
    
    import "./Catalogue.sol";
    
    contract GraphNode is Catalogue {
          
      function GraphNode(SmartKey _smartKey, address[] adminAddress, string _href) 
      public
      Catalogue(_smartKey, adminAddress)
      {      
          
          href=_href;
          for (uint i=0; i < adminAddress.length; i++) {
            addOwner(adminAddress[i]);
             
          } 
          addOwner(address(_smartKey));
          addOwner(address(this));
          
         
      }
      
      function upsertItem(GraphNode _node, string _href)
      public
      payable
      returns (bool)
      {  
    
          
          bytes32 hashVal = getHash(_href);
    
          if (getItem(_href) == 0x0)
          {
          
                items.push(address(_node));
                nodeData[hashVal]=address(_node);
          
          }
      
          smartKey.loadSmartKey.value(msg.value)(Key(this), address(_node), bytes32("NewCatalogue"));
                          
          return true;
          
      }
      
      function getItem(string _href) 
      public
      view
      returns (address) 
      {      
          if (bytes(_href).length < 1) {
              return this;
          } else {
          
              bytes32 hashVal=getHash(_href);
              
              if (nodeData[hashVal] != address(0)) 
              {
                 return nodeData[hashVal];
              }
          }      
    
          
          return 0x0;
          
      }
      
    
        
    }
    
    



******************************************************
Smart Node Contract (SmartNode.sol)
******************************************************

::

    pragma solidity ^0.4.18; 
    
    import "./GraphRoot.sol";
    
    contract SmartNode is Administered {
      
      SmartKey smartKey;
      GraphRoot graphRoot;
      
             
      function SmartNode(GraphRoot _graphRoot, SmartKey _smartKey, address[] adminAddress) 
        Administered(adminAddress)
        public
      {
          smartKey=_smartKey; 
          graphRoot=_graphRoot;
      }
    
      
      function upsertItem(GraphNode _parentNode, string _href)
      public
      payable
      returns (bool)
      {
          
         if (msg.value > 10000000) {
             address addr=graphRoot.getItem(_href);
             if (addr == address(0)) { 
                 
                  address[] memory _admins=new address[](4);
                 _admins[0]=msg.sender;
                 _admins[1]=address(_parentNode);  
                 _admins[2]=address(this);  
                 _admins[3]=address(graphRoot);  
                    
                 addr=address(new GraphNode(smartKey, _admins, _href));
                 
             }
             
             smartKey.putSmartKey(GraphNode(addr), addr);
             
             _parentNode.upsertItem.value(msg.value/2)(GraphNode(addr), _href);
             return graphRoot.upsertItem.value(msg.value/2)(GraphNode(addr), _href);
         }
         return false;
          
      }
        
      
    }


upsertItem(GraphNode _parentNode, string _href) public payable returns (bool)
==============================================================================

.. js:function:: upsertItem(GraphNode _parentNode, string _href) public payable returns (bool)

   :param address _parentNode: Ethereum Address of the Parent Graph Node Catalogue
   :param string _href: URL of the Catalogue to create or link (Catalogue is linked if URL is already catalogued)
   :returns: true or false
   :rtype: bool
   
    
.. index:: ! visibility, external, public, private, internal



******************************************************
MetaData Smart Contract (MetaData.sol)
******************************************************

::

    pragma solidity ^0.4.18;
    
    import "./admin/Administered.sol";
    import "./SmartKey.sol";
    
    contract MetaData is Administered {
           
      SmartKey smartKey;
      string public rel;
      string public val;
     
      function MetaData(SmartKey _smartKey, address[] adminAddress, string _rel, string _val) 
      public
      Administered(adminAddress)
      {
          smartKey=_smartKey;
          rel=_rel;
          val=_val;
      }
      
      function setVal(string _val) 
      public
      onlyAdmin
      returns (bool)
      {
      
          val=_val;
          
          return true;
      }
      
    
    }
    
    
******************************************************
NodeMetaData Smart Contract (NodeMetaData.sol)
******************************************************


::

    pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

    import "./admin/Administered.sol";
    import "./SmartKey.sol";
    import "./MetaData.sol";
    
    contract NodeMetaData is Administered, Key {
           
      //PAS 212:2016
      MetaData[] public meta;
      mapping (bytes32 => MetaData) public itemMetaData; // rel is hashed to bytes32 data   
      //PAS 212:2016
      
      //event MetaDataUpdate(address indexed user, address indexed metaDataContract, string rel, string val);
      
      function NodeMetaData(SmartKey _smartKey, address[] adminAddress) 
      public
      Administered(adminAddress)
      Key(_smartKey, address(this))
      {
          smartKey=_smartKey;  
      }
    
      function getSmartKey()
      constant
      public
      returns (SmartKey)
      {
          return smartKey;
      }
    
      function selectMetaData() 
      constant
      public
      returns (MetaData[]) 
      {
             return meta;
      }
    
      
      function upsertMetaData(string _rel, string _val) 
      public
      payable
      returns (bool)
      {
      
          bytes32 hashVal=getHash(_rel);
          
    
          if (itemMetaData[hashVal] == address(0)) {
                address[] storage _admins=admins;
                _admins.push(address(this));
                _admins.push(msg.sender);
                itemMetaData[hashVal]=new MetaData(smartKey, admins, _rel, _val);
                meta.push(itemMetaData[hashVal]);
          } 
          
          smartKey.loadSmartKey.value(msg.value)(Key(this), address(itemMetaData[hashVal]), bytes32("MetaDataUpdate"));
          return true;
      }
     
    }
    
    
upsertMetaData(string _rel, string _val) public payable returns (bool)
==============================================================================

.. js:function:: upsertMetaData(string _rel, string _val) public payable returns (bool)

   :param string _rel: Meta Data Relationship
   :param string _val: Meta Data Value
   :returns: true if success, false if not successful
   :rtype: bool
   