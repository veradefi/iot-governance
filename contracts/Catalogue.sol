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
  constant
  public
  returns (address[]) 
  {
         return items;
  }
  
  function selectHref() 
  constant
  public
  returns (bytes) 
  {
         return bytes(href);
  }

  function setHref(string _href) 
  public
  payable
  returns (bool)
  {
      SmartKey(smartKey).addSmartKey.value(msg.value)(address(this), "NewCatalogueURL");
      
      href=_href;
      return true;      
  }

}