pragma solidity ^0.4.18; 

import "./GraphRoot.sol";

contract SmartRent is Administered {
  
  SmartKey smartKey;
  GraphRoot graphRoot;
  
         
  function SmartRent(GraphRoot _graphRoot, SmartKey _smartKey, address[] adminAddress) 
    Administered(adminAddress)
    public
  {
      smartKey=_smartKey; 
      graphRoot=_graphRoot;
  }

  
  function rentCatalogue(GraphNode _node)
  public
  payable
  {
    
    if (smartKey.balanceOf(msg.sender) >= smartKey.balanceOf(_node)) {
        //_node.removeOwner(_node.vault);
        //_node.vault=msg.sender;
        _node.addOwner(msg.sender);
        smartKey.loadSmartKey.value(msg.value)(Key(this), address(msg.sender), bytes32("Catalogue Rent"));
    }
  }
   

  
}