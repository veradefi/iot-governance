pragma solidity ^0.4.18;

import "./admin/Administered.sol";
import "./SmartKey.sol";

contract MetaData is Administered {
       
  SmartKey smartKey;
  string public rel;
  string public val;
 
  event MetaDataRel(address indexed user, MetaData indexed metaDataContract, string rel);
  event MetaDataVal(address indexed user, MetaData indexed metaDataContract, string rel, string val);

  function MetaData(SmartKey _smartKey, address[] adminAddress, string _rel) 
  public
  Administered(adminAddress)
  {
      smartKey=_smartKey;
      rel=_rel;
      MetaDataRel(msg.sender, this, rel);
  }
  
  function setVal(string _val) 
  public
  onlyAdmin
  returns (bool)
  {
  
      val=_val;
      
      MetaDataVal(msg.sender, this, rel, val);
      return true;
  }
  

}