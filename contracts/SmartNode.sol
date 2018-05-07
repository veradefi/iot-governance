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

  
  function upsertItem(GraphNode _parentNode, string _href)
  public
  payable
  returns (bool)
  {
      
     if (msg.value > 10000000000000) {
         address addr=graphRoot.getItem(_href);
         GraphNode _node;
         if (addr == 0x0) { 
             
             
              address[] memory _admins=new address[](3);
             _admins[0]=msg.sender;
             _admins[1]=address(_parentNode);  
             _admins[2]=address(this);  
                
             _node = new GraphNode(smartKey, _admins);
         } else {
             _node = GraphNode(addr);
         }
         smartKey.putSmartKey(_node, address(_node));
        
         
         _parentNode.upsertItem.value(msg.value/2)(_node, _href);
         return graphRoot.upsertItem.value(msg.value/2)(_node, _href);
     }
     return false;
      
  }
    
  
}