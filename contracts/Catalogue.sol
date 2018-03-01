pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

import "./CatalogueItem.sol";


contract Catalogue is NodeMetaData {
       
  // PAS212:216
  CatalogueItem[] public items;  
  // MetaData[] meta; // inherited from NodeMetaData
  // PAS212:216
  
  mapping (bytes32 => CatalogueItem) public catItemData; 
 
  //GraphNode public parentGraphNode;
  //GraphNode[] public childGraphNode;
  
  //event CatItemDataUpdate(address indexed user, CatalogueItem indexed catItem);

  function Catalogue(SmartKey _smartKey, address[] _adminAddress) 
  public
  NodeMetaData(_smartKey, _adminAddress) 
  {
  }
  
  function selectItems() 
  constant
  public
  returns (CatalogueItem[]) 
  {
         return items;
  }
  
  


}