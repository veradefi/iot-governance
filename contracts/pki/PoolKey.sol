pragma solidity ^0.4.18;

import './Key.sol';
import '../admin/Whitelisted.sol';

contract PoolKey is Key, Whitelisted 
{
    
    using SafeMath for uint256;
    bool public has_whitelist;
    bool public autoDistribute;
    address[] public members;
    mapping (address => uint256) public isMember;
    mapping (address => uint256) public received;
    address public poolVault;
    address public beneficiary;
    
    uint256 public max_contrib;
    uint256 public max_per_contrib;
    uint256 public min_per_contrib;
    uint256 public fee;
        
    function PoolKey(address _poolVault, address _beneficiary, uint256 _max_contrib, uint256 _max_per_contrib, uint256 _min_per_contrib, address[] _admins, bool _has_whitelist, uint256 _fee, bool _autoDistribute) 
    Whitelisted(_admins, _admins) 
    Key(_beneficiary) 
    public
    {
    
      poolVault=_poolVault;  
      fee=_fee;
      max_contrib=_max_contrib;
      max_per_contrib=_max_per_contrib;
      min_per_contrib=_min_per_contrib;
      contrib_amount=0;
      has_whitelist=_has_whitelist;
      autoDistribute=_autoDistribute;
      for (uint k=0; k < _admins.length; k++) {
          members.push(_admins[k]);
      }
          
    }
    
    function getMembers() 
    public
    constant 
    returns (address[]) 
    {
            return members;
    }
    
    function () 
    public
    payable 
    {
        transactions[msg.sender].push(transaction(msg.sender,now,msg.value, 0));
        
        if (autoDistribute) {
            contrib_amount=contrib_amount.add(msg.value);
            
            distributeEth(msg.value);
        } else {
            activateKey(msg.sender); 
        }
    }
    
    function distributeEth(uint256 weiAmount) 
    public
    returns (bool)
    {        
        if (weiAmount >= min_per_contrib && isMember[msg.sender] <= max_per_contrib) {
            if (!has_whitelist || isWhitelisted[msg.sender]) {
                uint256 fee1=weiAmount.div(200); 
                uint256 fee2=weiAmount.div(fee); 
                uint256 distAmount = weiAmount.sub(fee1).sub(fee2);
                distAmount = distAmount.div(members.length);
                
                poolVault.transfer(fee1);
                vault.transfer(fee2);
                received[poolVault] = received[poolVault].add(fee1);
                received[vault] = received[vault].add(fee2);
                transactions[poolVault].push(transaction(msg.sender,now,fee1, 0));
                transactions[vault].push(transaction(msg.sender,now,fee2, 0));
                
                isMember[msg.sender] = isMember[msg.sender].add(weiAmount);
                
                for (uint i=0; i < members.length; i++) 
                {
                    members[i].transfer(distAmount);
                    received[members[i]] = received[members[i]].add(distAmount);
                    transactions[members[i]].push(transaction(msg.sender,now,distAmount, 0));
                }
                
                
                if (isMember[msg.sender] == weiAmount) {
                    members.push(msg.sender);
                }
                
                return true;
            }
        }      
        return false;  
    }
    
}