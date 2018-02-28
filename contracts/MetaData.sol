import "./admin/Administered.sol";
import "./SmartKey.sol";


pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

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
  payable
  returns (bool)
  {
  
      smartKey.getSmartKey.value(msg.value)(address(this));

      val=_val;
      
      MetaDataVal(msg.sender, this, rel, val);
      return true;
  }
  

}