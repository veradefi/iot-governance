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
  
  function upsertItem(string _href)
  public
  payable
  returns (bool)
  {
      bytes32 hashVal=Key(SmartKey(smartKey).getKey(msg.sender)).getHash(_href);
      CatalogueItem catData;
      if (catItemData[hashVal] == address(0)) 
      {
            address[] memory _admins=new address[](2);
            _admins[0]=msg.sender;
            _admins[1]=address(this);
            catData = new CatalogueItem(SmartKey(smartKey), _admins);
      } 
      else 
      {
            catData = catItemData[hashVal];
      }
      
      catData.setHref.value(msg.value)(_href);
      
      if (catItemData[hashVal] == address(0)) 
      {
          catItemData[hashVal] = catData;
          items.push(catData);
      }
      return true;
  }

}