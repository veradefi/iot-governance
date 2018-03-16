pragma solidity ^0.4.18;

import './Key.sol';
import '../admin/Whitelisted.sol';

contract PoolKey is Key, Whitelisted 
{

    using SafeMath for uint256;
    address[] public members;
    mapping (address => uint) public isMember;
    address poolVault;
    address beneficiary;
    uint public contrib_amount;
    
    uint public max_contrib;
    uint public max_per_contrib;
    uint public min_per_contrib;
    uint public fee;
    
    
    function PoolKey(address _poolVault, address _beneficiary, uint _max_contrib, uint _max_per_contrib, uint _min_per_contrib, address[] _admins, address[] _whitelist, uint _fee) 
    Whitelisted(_admins, _whitelist) 
    Key(_beneficiary) 
    public
    {
    
      poolVault=_poolVault;  
      fee=_fee;
      max_contrib=_max_contrib;
      max_per_contrib=_max_per_contrib;
      min_per_contrib=_min_per_contrib;
      contrib_amount=0;
      
      for (uint k=0; k < _admins.length; k++) {
          members.push(_admins[k]);
      }
      

      for (uint i=0; i < _whitelist.length; i++) {
          if (!isAdmin[_whitelist[i]]) {
              members.push(_whitelist[i]);
          }
      }
      
    
    }
    
    function getMembers() 
    public
    constant 
    returns (address[]) 
    {
            return members;
    }
    
    // fallback function can be used to distribute tokens
    function () 
    public
    payable 
    {
    
        uint256 weiAmount = msg.value;
        if (weiAmount >= min_per_contrib && weiAmount <= max_per_contrib) {
            if (whitelist.length == 0 || isWhitelisted[msg.sender]) {
                uint256 fee1=weiAmount.div(200); 
                uint256 fee2=weiAmount.div(fee); 
                uint256 distAmount = weiAmount.sub(fee1).sub(fee2);
                distAmount = distAmount.div(members.length);
                
                poolVault.transfer(fee1);
                vault.transfer(fee2);
                
                
                isMember[msg.sender] = isMember[msg.sender].add(weiAmount);
                contrib_amount=contrib_amount.add(weiAmount);
            
                for (uint i=0; i < members.length; i++) 
                {
                    members[i].transfer(distAmount);
                }
                
                
                if (isMember[msg.sender] == weiAmount) {
                    members.push(msg.sender);
                }
                
            }
        }        
    }
    
}