pragma solidity ^0.4.18; 

import "./GraphRoot.sol";

contract SmartNode is Administered {
  
  SmartKey smartKey;
  GraphRoot graphRoot;
  
  function SmartNode(GraphRoot _graphRoot, SmartKey _smartKey, address[] adminAddress) 
    Administered(adminAddress)
    public
  {
      smartKey=_smartKey; 
      graphRoot=_graphRoot;
  }

  
  function upsertNode(GraphNode _parentNode, string _href)
  public
  payable
  returns (bool)
  {
      
      address[] memory _admins=new address[](3);
     _admins[0]=msg.sender;
     _admins[1]=address(_parentNode);  
     _admins[2]=address(this);  
          
     GraphNode _node = new GraphNode(smartKey, _admins);
     
     smartKey.putSmartKey(_node, address(_node));
      
     _parentNode.upsertNode.value(msg.value/2)(_node, _href);
     return graphRoot.upsertNode.value(msg.value/2)(_node, _href);
      
  }
    
  
}