pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use


/**
 * @title Admin
 * @dev The Admin contract has Admin addresses, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Administered {
  mapping (address => bool) public isAdmin;
  address[] public admins;

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Administered(address[] memory adminAddress) 
  public
  {
    for (uint i=0; i < adminAddress.length; i++) {
        isAdmin[adminAddress[i]]=true;
    } 
    admins=adminAddress;
  }


  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyAdmin() 
  {
    require(isAdmin[msg.sender]);
    _;
  }
  
  function addAdmin(address admin) 
  public
  onlyAdmin 
  {
        require(isAdmin[msg.sender]);
        isAdmin[admin]=true;
        admins.push(admin);
  }
  
  function addBanned(address banned)
  public
  onlyAdmin 
  {
        require(isAdmin[msg.sender]);
        isAdmin[banned]=false;
        for (uint i=0; i < admins.length; i++) {
            if (banned==admins[i]) {
                delete admins[i];
            }
        } 
        
        
  }

  function getAdmins() 
  public
  view 
  returns (address[] memory ) 
  {     

        return admins;
  }


}
