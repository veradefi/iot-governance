pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

import "./GraphBase.sol";

contract GraphNode is GraphBase {
  
    
  function GraphNode(SmartKey _smartKey, address[] adminAddress) 
  public
  GraphBase(_smartKey, adminAddress)
  {      
  }


}

