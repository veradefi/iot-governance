pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

import "./Catalogue.sol";

contract GraphNode is Catalogue {

  GraphNode[] nodes;
  mapping (bytes32 => GraphNode)  public nodeData; 

  GraphNode public parentData;
  
  function GraphNode(SmartKey _smartKey, address[] adminAddress) 
  public
  Catalogue(_smartKey, adminAddress)
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
  function selectGraphNode() 
  constant
  public
  returns (GraphNode[]) 
  {
         return nodes;
  }
  

  function upsertGraphNode(GraphNode _node, string _href)
  public
  payable
  returns (bool)
  {
      SmartKey(smartKey).getSmartKey.value(msg.value)(address(this));
      
      address[] memory _admins=new address[](2);
      _admins[0]=msg.sender;
      _admins[1]=address(this);  
        
      bytes32 hashVal=Key(smartKey.getKey(msg.sender)).getHash(_href);
      
      if (nodeData[hashVal] == address(0)) {
            
            nodeData[hashVal]=_node;
            nodes.push(nodeData[hashVal]);
                      
      }

      
      return true;
  }

  
 
  
}

