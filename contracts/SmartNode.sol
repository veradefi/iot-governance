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
      
     if (msg.value > 10000000) {
         address addr=graphRoot.getItem(_href);
         if (addr == address(0)) { 
             
              address[] memory _admins=new address[](4);
             _admins[0]=msg.sender;
             _admins[1]=address(_parentNode);  
             _admins[2]=address(this);  
             _admins[3]=address(graphRoot);  
                
             addr=address(new GraphNode(smartKey, _admins, _href));
             
         }
         
         smartKey.putSmartKey(GraphNode(addr), addr);
         
         _parentNode.upsertItem.value(msg.value/2)(GraphNode(addr), _href);
         return graphRoot.upsertItem.value(msg.value/2)(GraphNode(addr), _href);
     }
     return false;
      
  }
    
  
}