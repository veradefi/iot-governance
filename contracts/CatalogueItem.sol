import "./admin/Administered.sol";
import "./Catalogue.sol";
import "./SmartKey.sol";
import "./MetaData.sol";


pragma solidity ^0.4.11; //We have to specify what version of the compiler this code will use

contract CatalogueItem is Administered, Key {
       
  //PAS 212:2016
  string href;
  MetaData[] itemMetadata;
  //PAS 212:2016

  mapping (string => CatalogueItem) public catItemData; 
  mapping (string => MetaData) public itemMetaData;   
  CatalogueItem public parentCatalogueItem;
  CatalogueItem[] public childCatalogueItem;
  event CatItemMetaData(address indexed user, MetaData indexed catItemMetaData);
  SmartKey smartKey;

  function CatalogueItem(SmartKey _smartKey, address[] adminAddress) 
  public
  Administered(adminAddress)
  {
      smartKey=_smartKey;  
  }

}