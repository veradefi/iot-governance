import "./admin/Administered.sol";
import "./SmartKey.sol";
import "./CatalogueItem.sol";
import "./Catalogue.sol";


pragma solidity ^0.4.11; //We have to specify what version of the compiler this code will use

contract Database is Administered, Key {
       
  SmartKey smartKey;
  Catalogue[] catalogues;
  mapping (string => Catalogue) public catData; 
  
  MetaData[] databaseMetadata;    
  mapping (string => MetaData) public dbMetaData; 
  Database public parentData;
 
  function Database(SmartKey _smartKey, address[] adminAddress) 
  public
  Administered(adminAddress)
  {
      smartKey=_smartKey;    
  }
  
}