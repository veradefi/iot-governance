import "./Catalogue.sol";
import "./GraphNode.sol";

pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

contract GraphRoot is Catalogue {
       
  /*
  Catalogue[] catalogues;  
  mapping (bytes32 => Catalogue[]) public catData; 
  
  mapping (bytes32 => GraphNode[])  public childData; 
  */
  function GraphRoot(SmartKey _smartKey, address[] adminAddress) 
  public
  Catalogue(_smartKey, adminAddress)
  payable
  {
      smartKey.getSmartKey.value(msg.value)(address(this));
  }
  
  /* 
    
    ?rel=urn:X-hypercat:rels:1 
    ?rel=urn:X-hypercat:rels:2 
    ?rel=urn:X-hypercat:rels:3 
    ?val=1 
    ?val=2 
    ?val= 
    ?rel=urn:X-hypercat:rels:1&val=1 
    ?rel=urn:X-hypercat:rels:3&val=
    
  */
  /*
  function selectCatalogue(string rel) 
  constant
  public
  returns (Catalogue[]) 
  {
         return catData[getHash(rel)];        
  }

  function insertGraphNode() 
  pure
  public
  {
         
  }

  function updateGraphNode() 
  pure
  public
  {
  
  }
  
  function deleteGraphNode() 
  pure
  public
  {
  
  }
  */
  
}