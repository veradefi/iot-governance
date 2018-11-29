pragma solidity ^0.4.18;

import "./admin/Administered.sol";
import "./SmartKey.sol";

contract MetaData is Administered {
       
  SmartKey smartKey;
  string public rel;
  string public val;
 
  string[] public val_history;
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
  
      val_history.push(_val);
      val=_val;
      
      return true;
  }

  function getValHistoryCount()
  view
  public
  returns (uint256)
  {
    return val_history.length;
  }
  

}