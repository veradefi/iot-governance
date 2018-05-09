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

    event KeyEvent(address user, address key, address data_contract, uint256 eth_amount, bytes32 transaction_name, bytes32 health_status);
    
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
        return msg.value > 1000000000;
    }

    // fallback function can be used to buy tokens
    function () 
    public
    payable 
    {
        addSmartKey(getSmartKey(msg.sender), address(this), 'Deposit');
    }
    

    function getSmartKey(address beneficiary) 	
    public
    returns (Key) 
    { 
        if (smartKeys[beneficiary] == address(0)) 
        {
            smartKeys[beneficiary] = new Key(this, beneficiary); 
            //events[address(key)].push(event_transaction(beneficiary,now,msg.value, 0, 'ActivateKey', smartKeys[beneficiary].getHealthStatus()));
           
        }
      
        return smartKeys[beneficiary];
        
    }
    
    function addSmartKey(Key key, address data_contract,  bytes32 transaction_name) 
    public
    payable 
    returns(bool) 
    {
            require(address(key) != address(0));
            require(validPurchase());
            
            uint256 token=convertToToken(msg.value);            
            bytes32 healthStatus=key.getHealthStatus();
            
            KeyEvent(msg.sender, address(key), data_contract, msg.value, transaction_name, healthStatus);
            events[address(key)].push(event_transaction(data_contract,now,msg.value, 0, transaction_name, healthStatus));            
            tokenMinted = tokenMinted.add(token);
            balances[address(data_contract)] = balances[address(data_contract)].add(token);
            Transfer(address(0), address(data_contract), token);
   
            key.activateKey.value(msg.value)(address(data_contract));
            
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
