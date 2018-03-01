pragma solidity ^0.4.18; 

import "./GraphNode.sol";

contract SmartNodeItem is Administered {
  
  SmartKey smartKey;
    
  function SmartNodeItem(SmartKey _smartKey, address[] adminAddress) 
    Administered(adminAddress)
    public
  {
      smartKey=_smartKey; 
  }

  
  function upsertItem(GraphNode _catalogue, string _href)
  public
  payable
  returns (bool)
  {
      address[] memory _admins=new address[](3);
      _admins[0]=msg.sender;
      _admins[1]=address(_catalogue);
      _admins[2]=address(this);
      
      CatalogueItem catData = new CatalogueItem(smartKey, _admins);
      return _catalogue.upsertItem.value(msg.value)(catData, _href);

  }
  
  
}