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

    //event IssueSmartKey(address indexed user, address indexed key);
    //event ActivateSmartKey(address indexed user, address indexed key);
    
    event KeyEvent(address user, address key, uint256 transaction_type, uint256 eth_amount, bytes32 transaction_name, bytes32 health_status);
    
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
        bool nonZeroPurchase = msg.value > 10000000000000;
        return nonZeroPurchase;
    }

    // fallback function can be used to buy tokens
    function () 
    public
    payable 
    {
        addSmartKey(msg.sender, 'Deposit');
    }
    
    
    function addSmartKey(address beneficiary, bytes32 transaction_name) 
    public
    payable 
    returns(address) 
    {
            require(beneficiary != 0x0);
            require(validPurchase());
            

            Key key;
            if (smartKeys[beneficiary] == address(0)) 
            {
                key = new Key(this, beneficiary); 
                smartKeys[beneficiary] = key;
                //KeyEvent(msg.sender, address(key), 0,  0, 'IssueKey', key.getHealthStatus());
                //events[address(key)].push(event_transaction(beneficiary,now,msg.value, 0, 'ActivateKey', key.getHealthStatus()));
                //recordEvent(beneficiary, key, transaction_name, 0, msg.value);
                //IssueSmartKey(beneficiary, key);
            }
            else 
            {
                key = smartKeys[beneficiary];
            }

            
            KeyEvent(msg.sender, address(key), 0, msg.value, transaction_name, key.getHealthStatus());
            //events[address(key)].push(event_transaction(beneficiary,now,msg.value, 0, transaction_name, key.getHealthStatus()));
                        
            key.activateKey.value(msg.value)(address(key));
            key.addOwner(address(this));
            //ActivateSmartKey(beneficiary, key); 
            
            tokenMinted = tokenMinted.add(convertToToken(msg.value));
            
            balances[address(key)] = balances[address(key)].add(convertToToken(msg.value));
            //Mint(address(key), tokens);
            Transfer(address(0), address(key), convertToToken(msg.value));
            
            return address(key);
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
