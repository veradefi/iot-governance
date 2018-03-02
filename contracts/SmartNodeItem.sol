pragma solidity ^0.4.18; 

import "./GraphRoot.sol";

contract SmartNodeItem is Administered {
  
  SmartKey smartKey;
  GraphRoot graphRoot;
  
  function SmartNodeItem(GraphRoot _graphRoot, SmartKey _smartKey, address[] adminAddress) 
    Administered(adminAddress)
    public
  {
      smartKey=_smartKey; 
      graphRoot=_graphRoot;
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
      _catalogue.upsertItem.value(msg.value/2)(catData, _href);
      return graphRoot.upsertItem.value(msg.value/2)(catData, _href);

  }
  
  
}