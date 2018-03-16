pragma solidity ^0.4.18;

import './Key.sol';
import '../admin/Whitelisted.sol';

contract PoolKey is Key, Whitelisted 
{

    using SafeMath for uint256;
    address[] members;
    mapping (address => bool) public isMember;
    address poolVault;
    address beneficiary;
    uint max_contrib;
    uint max_per_contrib;
    uint min_per_contrib;
    uint fee;
    
    
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
      
      
      for (uint k=0; k < _admins.length; k++) {
          members.push(_admins[k]);
          isMember[_admins[k]]=true;
      }
      

      for (uint i=0; i < _whitelist.length; i++) {
          members.push(_whitelist[i]);
          isMember[_whitelist[i]]=true;
      }
      
    
    }
    
    // fallback function can be used to distribute tokens
    function () 
    public
    payable 
    {
    
        uint256 weiAmount = msg.value;
        uint256 fee1=weiAmount.div(200); 
        uint256 fee2=weiAmount.div(fee); 
        uint256 distAmount = weiAmount.sub(fee1).sub(fee2);
        distAmount = distAmount.div(members.length);
        
        poolVault.transfer(fee1);
        vault.transfer(fee2);
        
        if (!isMember[msg.sender]) {
            isMember[msg.sender]=true;
        }
        
        for (uint i=0; i < members.length; i++) 
        {
            members[i].transfer(distAmount);
        }
        
    }
    
}