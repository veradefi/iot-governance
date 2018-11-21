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

    event KeyEvent(address key, address transacting_contract, uint256 eth_amount, bytes32 transaction_name, bytes32 health_status, bytes32 user_health_status);
    
    mapping (address => Key) public  smartKeys;

    struct event_transaction {
        
        address account;
        uint256 date;
        uint256 amount;
        //uint256 transaction_type;
        bytes32 transaction_name;
        bytes32 health_status;
        bytes32 user_health_status;
        
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
        return msg.value >= 0;
    }

    // fallback function can be used to buy tokens
    function () 
    public
    payable 
    {
        loadSmartKey(getSmartKey(msg.sender), msg.sender, 'Deposit');
    }
    
    function getSmartKey(address beneficiary) 	
    public
    view
    returns (Key) 
    { 
      
        return smartKeys[beneficiary];
        
    }

    function getEventCount(address _address) 
    view
    public
    returns (uint256)
    {
       return events[_address].length;
    }

    function loadSmartKey(Key key, address transacting_contract,  bytes32 transaction_name) 
    public
    payable 
    returns(bool) 
    {
            uint256 token=convertToToken(msg.value) + convertToToken(msg.gas);            
            //require(address(key) != address(0));
            //require(validPurchase());
            
            if (address(key) == address(0) || smartKeys[transacting_contract] == address(0)) 
            {
                key = new Key(this, transacting_contract); 
                smartKeys[transacting_contract]=key;
            }
            
            bytes32 healthStatus=key.getHealthStatus();
            bytes32 userHealthStatus=smartKeys[transacting_contract].getHealthStatus();

            KeyEvent(address(key), transacting_contract, token, transaction_name, healthStatus, userHealthStatus);
            events[address(key)].push(event_transaction(transacting_contract,now, token, transaction_name, healthStatus, userHealthStatus));                        
            
            
            tokenMinted = tokenMinted + token; //.add(token);
            balances[address(key)] = balances[address(key)].add(token);
            Transfer(address(0), address(key), token);
            
            tokenMinted = tokenMinted + token; //.add(token);
            balances[address(transacting_contract)] = balances[address(transacting_contract)].add(token);
            Transfer(address(0), address(transacting_contract), token);
            
            //mint(address(key), token);
            key.activateKey.value(msg.value)(address(transacting_contract));
            
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
        mint(beneficiary, msg.gas);
        mint(address(key), msg.gas);
        
    }
    
    function addOwner(address _user) 
    onlyAdmin
    public
    {
        require(_user != 0x0);
        require(smartKeys[_user] != address(0));
        smartKeys[_user].addOwner(msg.sender);
    }

    /*
 
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
    */

    function transferFromKey(uint amount, address sender, address beneficiary, bool isEth) 
    public
    {
        require(sender != 0x0);
        require(beneficiary != 0x0);
        require(smartKeys[sender] != address(0));
        if (isAdmin[msg.sender] || smartKeys[sender].isOwner(msg.sender)) {
            bytes32 healthStatus=smartKeys[sender].getHealthStatus();
            bytes32 transferName="Transfer To";
            if (isEth) {
                smartKeys[sender].transferEth(amount, beneficiary);
                transferName="Transfer ETH To";

            } else {
                smartKeys[sender].transfer(amount, beneficiary);
            }
            KeyEvent(address(smartKeys[sender]), beneficiary, amount, transferName, healthStatus,healthStatus);
            events[address(smartKeys[sender])].push(event_transaction(beneficiary,now,amount, transferName, healthStatus, healthStatus));                        

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
