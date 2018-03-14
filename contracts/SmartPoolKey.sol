pragma solidity ^0.4.18;

import "./pki/PoolKey.sol";
import "./SmartKey.sol";

contract SmartPoolKey is Administered
{
    SmartKey smartKey;
    address vault;
    mapping (address => PoolKey) public  smartPoolKeys;
    
    function SmartPoolKey(SmartKey _smartKey, address[] adminAddress) 
    Administered(adminAddress)
    public
    {
    
        smartKey=_smartKey;
        vault=adminAddress[0];
    }
    
    function setVault(address _vault) 
    onlyAdmin 
    public
    returns (bool) {
        vault=_vault;
        return true;                
    }
    
    function getSmartPoolKey(address beneficiary, uint max_contrib, uint max_per_contrib, uint min_per_contrib, address[] admins, address[] whitelist, uint fee) 
    public
    {
        require(beneficiary != 0x0);
        PoolKey key;
        if (smartPoolKeys[beneficiary] == address(0)) 
        {
            key = new PoolKey(vault, beneficiary, max_contrib, max_per_contrib, min_per_contrib, admins, whitelist, fee);    
        }
        else 
        {
            key = smartPoolKeys[beneficiary];
        }
        
    }
    
}
