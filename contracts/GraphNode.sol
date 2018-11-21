pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

import "./Catalogue.sol";

contract GraphNode is Catalogue {

  //event NewCatalogue(address indexed user, address indexed parentNode, address indexed childNode, string href);
  
  function GraphNode(SmartKey _smartKey, address[] adminAddress, string _href) 
  public
  Catalogue(_smartKey, adminAddress)
  {      
      
      href=_href;
      for (uint i=0; i < adminAddress.length; i++) {
        addOwner(adminAddress[i]);
         
      } 
      addOwner(address(_smartKey));
      addOwner(address(this));
      
     
  }
  
  function upsertItem(GraphNode _node, string _href)
  public
  payable
  returns (bool)
  {  

      
      bytes32 hashVal = getHash(_href);

      if (getItem(_href) == 0x0)
      {
      
            items.push(address(_node));
            nodeData[hashVal]=address(_node);
      
      }
  
      smartKey.loadSmartKey.value(msg.value)(Key(this), address(_node), bytes32("NewCatalogue"));
      
      //NewCatalogue(msg.sender, address(this), address(_node), _href);
            
      return true;
      
  }
  
  function getItem(string _href) 
  public
  view
  returns (address) 
  {      
      if (bytes(_href).length < 1) {
          return this;
      } else {
      
          bytes32 hashVal=getHash(_href);
          
          if (nodeData[hashVal] != address(0)) 
          {
             return nodeData[hashVal];
          }
      }      

      
      return 0x0;
      
  }
   

}

