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
    
    
    function getKey(address user) 	
    public
    view
    returns (Key) 
    {    
        
        return smartKeys[user];
        
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
        getSmartKey(msg.sender);
    }

    
    function getSmartKey(address beneficiary) 
    public
    payable 
    {
        require(beneficiary != 0x0);
        require(validPurchase());
        
        uint256 weiAmount = msg.value;

        // calculate token amount to be created
        uint256 tokens = convertToToken(weiAmount);
        
        if (tokens > 0) 
        {
            Key key;
            if (smartKeys[beneficiary] == address(0)) 
            {
                key = new Key(vault); 
                smartKeys[beneficiary] = key;
                IssueSmartKey(beneficiary, key);
            }
            else 
            {
                key = smartKeys[beneficiary];
            }

            key.activateKey.value(msg.value)(beneficiary);
            
            ActivateSmartKey(beneficiary, key); 
            
            tokenMinted = tokenMinted.add(tokens);
            
            balances[beneficiary] = balances[beneficiary].add(tokens);
            Mint(beneficiary, tokens);
            Transfer(address(0), beneficiary, tokens);
        }        
        
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
