import "./admin/Administered.sol";
import "./Catalogue.sol";
import "./SmartKey.sol";
import "./MetaData.sol";


pragma solidity ^0.4.11; //We have to specify what version of the compiler this code will use

contract CatalogueItem is Administered, Key {
       
  SmartKey smartKey;
  string href;
  MetaData[] itemMetadata;
  mapping (string => CatalogueItem) public catItemData; 
  mapping (string => MetaData) public itemMetaData; 
  
  event CatItemMetaData(address indexed user, MetaData indexed catItemMetaData);

  function CatalogueItem(SmartKey _smartKey, address[] adminAddress) 
  public
  Administered(adminAddress)
  {
      smartKey=_smartKey;  
  }

}