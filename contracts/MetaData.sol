pragma solidity ^0.4.18;

import "./admin/Administered.sol";
import "./SmartKey.sol";

contract MetaData is Administered {
       
  SmartKey smartKey;
  string public rel;
  string public val;
 
  function MetaData(SmartKey _smartKey, address[] adminAddress, string _rel, string _val) 
  public
  Administered(adminAddress)
  {
      smartKey=_smartKey;
      rel=_rel;
      val=_val;
  }
  
  function setVal(string _val) 
  public
  onlyAdmin
  returns (bool)
  {
  
      val=_val;
      
      return true;
  }
  

}