import "./CatalogueItem.sol";


pragma solidity ^0.4.11; //We have to specify what version of the compiler this code will use

contract Catalogue is CatalogueItem {
       
  // PAS212:216
  CatalogueItem[] public items;  
  // MetaData[] meta; // inherited from CatalogueItem
  // PAS212:216
  
  mapping (bytes32 => CatalogueItem) public catItemData; 
 
  //GraphNode public parentGraphNode;
  //GraphNode[] public childGraphNode;
  
  //event CatItemDataUpdate(address indexed user, CatalogueItem indexed catItem);
  
  SmartKey smartKey;


  function Catalogue(SmartKey _smartKey, address[] adminAddress) 
  public
  CatalogueItem(_smartKey, adminAddress) 
  {
      smartKey=_smartKey;
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
      Key key=smartKey.getKey(msg.sender);
      bytes32 hashVal=key.getHash(_href);
      CatalogueItem catData;
      if (catItemData[hashVal] == address(0)) {
            address[] storage _admins=admins;
            _admins.push(address(this));
            _admins.push(msg.sender);
            //address[] memory _admins=new address[](2);
            //_admins[0]=msg.sender;
            //_admins[1]=address(this);
            catData = new CatalogueItem(smartKey, admins);
      } 
      else 
      {
            catData = catItemData[hashVal];
      }
      
      
      catData.setHref.value(msg.value)(_href);
      
      if (catItemData[hashVal] == address(0)) {
          catItemData[hashVal]=catData;
          items.push(catData);
      }
      return true;
  }

}