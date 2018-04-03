pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

import "./Catalogue.sol";

contract GraphNode is Catalogue, Key {
 
  GraphNode[] public nodes;
  mapping (bytes32 => GraphNode)  public nodeData; 

  //GraphNode public parentData;
  function GraphNode(SmartKey _smartKey, address[] adminAddress) 
  public
  Catalogue(_smartKey, adminAddress)
  Key(address(this))
  {      
      
      for (uint i=0; i < adminAddress.length; i++) {
        addOwner(adminAddress[i]);
         
      } 
     
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
  function selectGraphNode() 
  constant
  public
  returns (GraphNode[]) 
  {
         return nodes;
  }
  
  function getGraphNode(string _href) 
  constant
  public
  returns (GraphNode) 
  {
      //bytes32 hashVal=Key(smartKey.getKey(address(this))).getHash(_href);
      bytes32 hashVal=getHash(_href);
      
      if (nodeData[hashVal] != address(0)) 
      {
         return nodeData[hashVal];
      }
      
      if (bytes(_href).length < 1)
      {
          return this;
      }
  }
  
  
  function upsertNode(GraphNode _node, string _href)
  public
  payable
  returns (bool)
  {  
      //smartKey.addSmartKey.value(msg.value)(address(vault));  
      //bytes32 hashVal=Key(smartKey.getKey(address(vault))).getHash(_href);
      smartKey.addSmartKey.value(msg.value)(address(this));

      bytes32 hashVal=getHash(_href);
      
      if (nodeData[hashVal] == address(0)) 
      {
      
            nodeData[hashVal]=_node;
            nodes.push(nodeData[hashVal]);
                      
      }
      //smartKey.addSmartKey.value(msg.value)(address(vault));
      //vault.transfer(msg.value);
      
      return true;
      
  }
  
  function getItem(string _href) 
  constant
  public
  returns (CatalogueItem) 
  {
      //bytes32 hashVal=Key(SmartKey(smartKey).getKey(msg.sender)).getHash(_href);
      
      bytes32 hashVal=getHash(_href);
      
      if (catItemData[hashVal] != address(0)) 
      {
         return catItemData[hashVal];
      }
  }
  

  
  function upsertItem(CatalogueItem catData, string _href)
  public
  payable
  returns (bool)
  {
      //bytes32 hashVal=Key(SmartKey(smartKey).getKey(msg.sender)).getHash(_href);
      
      bytes32 hashVal=getHash(_href);
            
      if (catItemData[hashVal] == address(0)) 
      {
          catItemData[hashVal] = catData;
          items.push(catData);
          catData.setHref.value(msg.value)(_href);
      }
      return true;
  }
  
  
  /*
  function upsertNode(string _href)
  public
  payable
  returns (bool)
  {

      smartKey.addSmartKey.value(msg.value)(address(vault));      
  
      address[] memory _admins=new address[](2);
     _admins[0]=msg.sender;
     _admins[1]=address(this);  
   
      bytes32 hashVal=Key(smartKey.getKey(address(this))).getHash(_href);
      
      if (nodeData[hashVal] == address(0)) 
      {
      
            GraphNode _node = new GraphNode(smartKey, _admins);
            nodeData[hashVal]=_node;
            nodes.push(nodeData[hashVal]);
                      
      }
      return true;
      
  }
        
  */

   /*
  function upsertItem(string _href)
  public
  payable
  returns (bool)
  {
      bytes32 hashVal=Key(SmartKey(smartKey).addSmartKey(msg.sender)).getHash(_href);
      CatalogueItem catData;
      if (catItemData[hashVal] == address(0)) 
      {
            address[] memory _admins=new address[](2);
            _admins[0]=msg.sender;
            _admins[1]=address(this);
            catData = new CatalogueItem(SmartKey(smartKey), _admins);
      } 
      else 
      {
            catData = catItemData[hashVal];
      }
      
      catData.setHref.value(msg.value)(_href);
      
      if (catItemData[hashVal] == address(0)) 
      {
          catItemData[hashVal] = catData;
          items.push(catData);
      }
      return true;
  }
  */
  
}

