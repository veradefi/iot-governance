import "./admin/Administered.sol";
import "./SmartKey.sol";
import "./CatalogueItem.sol";
import "./MetaData.sol";


pragma solidity ^0.4.11; //We have to specify what version of the compiler this code will use

contract Catalogue is Administered, Key {
       
  // PAS212:216
  CatalogueItem[] items;  
  MetaData[] catalogueMetadata;    
  // PAS212:216
  
  mapping (string => CatalogueItem) public catItemData; 
  mapping (string => MetaData) public catMetaData; 
  Catalogue public parentCatalogue;
  Catalogue[] public childCatalogue;
  event CatItemData(address indexed user, CatalogueItem indexed catItem);
  event CatMetaData(address indexed user, MetaData indexed catMetData);
  SmartKey smartKey;
  
  function Catalogue(SmartKey _smartKey, address[] adminAddress) 
  public
  Administered(adminAddress)
  {
      smartKey=_smartKey;    
  }

}