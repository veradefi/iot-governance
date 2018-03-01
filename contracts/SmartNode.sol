pragma solidity ^0.4.18; 

import "./GraphNode.sol";

contract SmartNode is Administered {
  
  SmartKey smartKey;
    
  function SmartNode(SmartKey _smartKey, address[] adminAddress) 
    Administered(adminAddress)
    public
  {
      smartKey=_smartKey; 
  }

  
  function upsertGraphNode(GraphBase _parentNode, string _href)
  public
  payable
  returns (bool)
  {
      
      address[] memory _admins=new address[](3);
     _admins[0]=msg.sender;
     _admins[1]=address(_parentNode);  
     _admins[2]=address(this);  
   
      GraphBase _node = new GraphBase(smartKey, _admins);

      return _parentNode.upsertGraphBase.value(msg.value)(_node, _href);
  }
    
  
}