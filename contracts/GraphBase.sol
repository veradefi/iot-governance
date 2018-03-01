pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

import "./Catalogue.sol";

contract GraphBase is Key {
 
   
  function GraphBase(SmartKey _smartKey, address[] adminAddress) 
  public
  Key(msg.sender)
  {      
      
  }  
 
  
}

