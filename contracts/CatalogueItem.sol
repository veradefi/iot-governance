pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

import "./admin/Administered.sol";
import "./NodeMetaData.sol";

contract CatalogueItem is NodeMetaData {
  
  //PAS 212:2016
  string public href;
  // MetaData[] public meta;
  // mapping (bytes32 => MetaData) public itemMetaData; // rel is hashed to bytes32 data   
  //PAS 212:2016

  //Catalogue public parentCatalogue;
  //Catalogue[] public childCatalogue;
  
  function CatalogueItem(SmartKey _smartKey, address[] adminAddress) 
  public
  NodeMetaData(_smartKey, adminAddress)
  {
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
      SmartKey(smartKey).addSmartKey.value(msg.value)(address(this));
      
      href=_href;
      return true;      
  }


}