pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

import "./GraphNode.sol";

contract GraphRoot is GraphNode
{
      
  function GraphRoot(SmartKey _smartKey, address[] adminAddress, string _href) 
  public
  GraphNode(_smartKey, adminAddress, _href)
  {
  }
  
}