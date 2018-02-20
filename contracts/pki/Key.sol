pragma solidity ^0.4.11;

import '../math/SafeMath.sol';
import '../ownership/Ownable.sol';

contract Key is Ownable {
    using SafeMath for uint256;
    
    enum State { Issued, Active, Returned }

    mapping (address => uint256) public activated;
    address public vault;
    State public state;

    event Issued();
    event Activate();
    event Returned(address indexed beneficiary, uint256 weiAmount);
   
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

   function Key(address _vault) 
   public
   {
        require(_vault != 0x0);
        vault = _vault;
        state = State.Issued;
        Issued();
   }

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
    
   function () 
   public
   payable 
   {
        activateKey(msg.sender);
   }

   
   function activateKey(address user) 
   public
   onlyOwner 
   payable 
   {
        state = State.Active;
        Activate();
        vault.transfer(msg.value);
        activated[user] = activated[user].add(msg.value);
   }

   function returnKey(address user) 
   public
   onlyOwner 
   {
        require(state == State.Active);
        uint256 activatedValue = activated[user];
        activated[user] = 0;
        user.transfer(activatedValue);
        state = State.Returned;
        Returned(user, activatedValue);
   }
}