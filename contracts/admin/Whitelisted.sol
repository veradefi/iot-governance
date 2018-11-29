pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

import './Administered.sol';

/**
 * @title Whitelist
 * @dev The Whitelist contract has Whitelist addresses, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Whitelisted is Administered {
  mapping (address => bool) public isWhitelisted;
  address[] public whitelist;
  bool hasWhitelist;

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Whitelisted(address[] adminAddress, address[] whitelistAddress) 
  Administered(adminAddress)
  public
  {
    if (whitelistAddress.length > 0) {
        for (uint i=0; i < whitelistAddress.length; i++) {
            isWhitelisted[whitelistAddress[i]]=true;
        } 
        whitelist=whitelistAddress;
        hasWhitelist=true;
    } else {
        hasWhitelist=false;
    }
  }


  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyWhitelist() 
  {    
    require(!hasWhitelist || isWhitelisted[msg.sender]);
    _;
  }
  
  function addWhitelist(address _whitelistAddress) 
  public
  onlyAdmin
  {
        isWhitelisted[_whitelistAddress]=true;
        whitelist.push(_whitelistAddress);
        hasWhitelist=true;
  }

  function removeWhitelist(address _user) 
  public
  onlyAdmin
  {
        isWhitelisted[_user]=false;
        for (uint i=0; i < whitelist.length; i++) {
            if (_user==whitelist[i]) {
                delete whitelist[i];
            }
        } 
        
  }
  

  function getWhitelist() 
  public
  view 
  returns (address[]) 
  {
        //require(isWhitelisted[msg.sender]);
        //require(!isBanned[msg.sender]);
        return whitelist;
  }


}
