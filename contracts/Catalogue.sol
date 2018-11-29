pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

import "./NodeMetaData.sol";

contract Catalogue is NodeMetaData {
       
  // PAS212:216
  string public href;
  address[] public items;  
  // MetaData[] meta; // inherited from NodeMetaData
  // PAS212:216
  
  mapping (bytes32 => address) public nodeData; 
 
  function Catalogue(SmartKey _smartKey, address[] _adminAddress) 
  public
  NodeMetaData(_smartKey, _adminAddress) 
  {
  }
  
  function selectItems() 
  view
  public
  returns (address[]) 
  {
         return items;
  }

  function setHref(string _href) 
  public
  onlyAdmin
  returns (bool)
  {
      
      href=_href;
      return true;      
  }

  

}