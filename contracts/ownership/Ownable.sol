pragma solidity ^0.4.18;


/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  mapping (address => bool) public isOwner;
 

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    isOwner[msg.sender]=true;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(isOwner[msg.sender]);
    
    _;
  }

  
  function addOwner(address _owner) 
  public
  onlyOwner 
  {
        require(isOwner[msg.sender]);
        isOwner[_owner]=true;
  }

  function removeOwner(address _owner) 
  public
  onlyOwner 
  {
        require(isOwner[msg.sender]);
        isOwner[_owner]=false;
  }

}
