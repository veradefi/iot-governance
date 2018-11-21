pragma solidity ^0.4.18;

import '../math/SafeMath.sol';
import '../ownership/Ownable.sol';
import '../SmartKey.sol';

contract Key is Ownable {
   
   using SafeMath for uint256;
    
   enum State { Issued, Active, Alert }
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

   function transfer(uint amount, address beneficiary) 
   public
   onlyOwner 
   {
        require(state == State.Active);
        smartKey.transfer(beneficiary, amount);
        transactions[address(this)].push(transaction(beneficiary,now,amount, 1));
   }
   
   function setHealth(Health _health) 
   public
   payable
   {
   
            health = _health;
            
            if (uint256(_health) > 1) {
                smartKey.loadSmartKey.value(msg.value)(this, msg.sender, bytes32('HealthWarning'));
                state=State.Alert;
                
            } else {
                smartKey.loadSmartKey.value(msg.value)(this, msg.sender, bytes32('HealthUpdate'));
                state=State.Active;
                
            }
            HealthUpdate(_health);
                        
            contrib_amount=contrib_amount.add(msg.value);    
            transactions[address(this)].push(transaction(msg.sender,now,msg.value, 0));
            //activated[msg.sender] = activated[msg.sender].add(msg.value);     
            //if (vault != address(this) && vault != address(msg.sender)) {
            //    vault.transfer(msg.value);
            //}
   
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

    
   /*
   function returnKey() 
   public
   onlyOwner 
   {
        require(state == State.Active);
        state = State.Returned;
   }
   
   */

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