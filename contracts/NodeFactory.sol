pragma solidity ^0.4.18; 

import "./GraphNode.sol";

contract NodeFactory {

  function getGraphNode(SmartKey smartKey, address[] admins) 
  public
  returns (GraphNode)
  {
    return new GraphNode(smartKey, admins);
  }
 
  
}