pragma solidity ^0.4.11;

import "./pki/Key.sol";
import "./token/MintableToken.sol";
import "./math/SafeMath.sol";


contract SmartKey is MintableToken {
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
    
    
    function getKey() 	
    public
    view
    returns (address) 
    {    
        
        return smartKeys[msg.sender];
        
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
    function validPurchase() internal constant returns (bool) {
        bool nonZeroPurchase = msg.value != 0;
        return nonZeroPurchase;
    }

    // fallback function can be used to buy tokens
    function () 
    public
    payable 
    {
        buySmartKey(msg.sender);
    }

    
    function buySmartKey(address beneficiary) 
    public
    payable 
    {
        require(beneficiary != 0x0);
        require(validPurchase());
        
        uint256 weiAmount = msg.value;

        // calculate token amount to be created
        uint256 tokens = convertToToken(weiAmount);
    
        if (tokens > 0) {
            Key key;
            if (smartKeys[msg.sender] == address(0)) {
                key = new Key(vault); 
                smartKeys[msg.sender] = key;
                IssueSmartKey(msg.sender, key);
            } else {
                key = smartKeys[msg.sender];
            }

            key.activateKey(msg.sender);
            
            ActivateSmartKey(msg.sender, key);            

            mint(beneficiary, tokens);          
            
            vault.transfer(msg.value);
        
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
