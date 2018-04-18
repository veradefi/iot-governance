pragma solidity ^0.4.18;

import '../math/SafeMath.sol';
import '../ownership/Ownable.sol';

contract Key is Ownable {
   
   using SafeMath for uint256;
    
   enum State { Issued, Active, Returned }
   event KeyStateUpdate(address indexed beneficiary, address indexed vault, State status);
    
   enum Health { Provisioning, Certified, Modified, Compromised, Malfunctioning, Harmful, Counterfeit }
   event HealthUpdate(Health status);
    
   address public vault;
   State public state;
   Health public health;
   
   uint256 public contrib_amount;
    
   mapping (address => uint256) public activated;

   struct transaction {
        
        address from;
        uint256 date;
        uint256 amount;
        
        uint256 transaction_type;
        
   }
    
   mapping (address => transaction[]) public transactions;

   function Key(address _vault) 
   public
   {
        require(_vault != 0x0);
        vault = _vault;
        state = State.Issued;
        isOwner[_vault]=true;
        KeyStateUpdate(msg.sender, vault, state);
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

        health = _health;
        HealthUpdate(_health);
        
        activated[msg.sender] = activated[msg.sender].add(msg.value);     
        
        contrib_amount=contrib_amount.add(msg.value);    
        transactions[address(this)].push(transaction(msg.sender,now,msg.value, 0));
        
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
   
   function activateKey(address user) 
   public
   payable
   {

        // payable 
   
        state = State.Active;
        KeyStateUpdate(msg.sender, vault, state);
        activated[user] = activated[user].add(msg.value);     
        
        contrib_amount=contrib_amount.add(msg.value);    
        transactions[address(this)].push(transaction(msg.sender,now,msg.value, 0));
        //if (vault != address(this)) {
        //    vault.transfer(msg.value);
        //}

   }

    
   function returnKey() 
   public
   onlyOwner 
   {
        require(state == State.Active);
        state = State.Returned;
        KeyStateUpdate(msg.sender, vault, state);
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
    
   /*
   struct Attr {
        address user;
        string attrType;
        bool has_proof;
        bytes32 id;
        string data;
        string datahash;
   }

   struct Sign {
        address signer;
        uint attrID;
        uint expiry;
   }

   struct Rev {
        uint signID;
   }

   Attr[] public attrs;
   Sign[] public signs;
   Rev[] public revs;

   event AttrAdded(uint indexed attrID, address indexed user, string attrType, bool has_proof, bytes32 indexed id, string data, string datahash);
   event AttrSigned(uint indexed signID, address indexed signer, uint indexed attrID, uint expiry);
   event SignRev(uint indexed revID, uint indexed signID);

   
   function addAttr(string attrType, bool has_proof, bytes32 id, string data, string datahash) 
   public
   returns (uint attrID) 
   {
        attrID = attrs.length++;
        Attr storage attr = attrs[attrID];
        attr.user = msg.sender;
        attr.attrType = attrType;
        attr.has_proof = has_proof;
        attr.id = id;
        attr.data = data;
        attr.datahash = datahash;
        AttrAdded(attrID, msg.sender, attrType, has_proof, id, data, datahash);
   }

   function signAttr(uint attrID, uint expiry)
   public
   returns (uint signID) 
   {
        signID = signs.length++;
        Sign storage sign = signs[signID];
        sign.signer = msg.sender;
        sign.attrID = attrID;
        sign.expiry = expiry;
        AttrSigned(signID, msg.sender, attrID, expiry);
   }

   function revSign(uint signID) 
   public
   returns (uint revID) 
   {
        if (signs[signID].signer == msg.sender) {
            revID = revs.length++;
            Rev storage rev = revs[revID];
            rev.signID = signID;
            SignRev(revID, signID);
        }
   }
   
   
   */

   
}