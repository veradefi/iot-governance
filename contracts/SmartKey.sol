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
