import "./admin/Administered.sol";
import "./SmartKey.sol";
import "./CatalogueItem.sol";
import "./Catalogue.sol";


pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

contract GraphNode is Administered, Key {
       
  SmartKey smartKey;
  Catalogue[] catalogues;  
  MetaData[] graphMetadata;    

  mapping (bytes32 => Catalogue) public catData; 
  mapping (bytes32 => MetaData)  public dbMetaData; 
  GraphNode public parentData;
  GraphNode[] public childData;
  
  function GraphNode(SmartKey _smartKey, address _vault, address[] adminAddress) 
  public
  Administered(adminAddress)
  Key(_vault)
  {
      smartKey=_smartKey;    
  }
  
}