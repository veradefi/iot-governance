pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

import "./Catalogue.sol";

contract GraphBase is Catalogue, Key {
 
  GraphBase[] public nodes;
  mapping (bytes32 => GraphBase)  public nodeData; 

  //GraphBase public parentData;
   
  function GraphBase(SmartKey _smartKey, address[] adminAddress) 
  public
  Catalogue(_smartKey, adminAddress)
  Key(msg.sender)
  {      
      
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
  function selectGraphBase() 
  constant
  public
  returns (GraphBase[]) 
  {
         return nodes;
  }
  
  function getGraphBase(string _href) 
  constant
  public
  returns (GraphBase) 
  {
      //bytes32 hashVal=Key(smartKey.getKey(address(this))).getHash(_href);
      bytes32 hashVal=getHash(_href);
      
      if (nodeData[hashVal] != address(0)) 
      {
         return nodeData[hashVal];
      }
  }
  
  
  function upsertGraphBase(GraphBase _node, string _href)
  public
  payable
  returns (bool)
  {  
      //smartKey.getSmartKey.value(msg.value)(address(this));  
      //bytes32 hashVal=Key(smartKey.getKey(address(this))).getHash(_href);
      bytes32 hashVal=getHash(_href);
      
      if (nodeData[hashVal] == address(0)) 
      {
      
            nodeData[hashVal]=_node;
            nodes.push(nodeData[hashVal]);
                      
      }
      smartKey.getSmartKey.value(msg.value)(address(this));
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
  function upsertGraphBase(string _href)
  public
  payable
  returns (bool)
  {

      smartKey.getSmartKey.value(msg.value)(address(this));      
  
      address[] memory _admins=new address[](2);
     _admins[0]=msg.sender;
     _admins[1]=address(this);  
   
      bytes32 hashVal=Key(smartKey.getKey(address(this))).getHash(_href);
      
      if (nodeData[hashVal] == address(0)) 
      {
      
            GraphBase _node = new GraphBase(smartKey, _admins);
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
      bytes32 hashVal=Key(SmartKey(smartKey).getKey(msg.sender)).getHash(_href);
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

