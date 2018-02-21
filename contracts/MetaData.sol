import "./admin/Administered.sol";
import "./SmartKey.sol";


pragma solidity ^0.4.11; //We have to specify what version of the compiler this code will use

contract MetaData is Administered, Key {
       
  SmartKey smartKey;
  string rel;
  string val;
  
  function MetaData(SmartKey _smartKey, address[] adminAddress) 
  public
  Administered(adminAddress)
  {
      smartKey=_smartKey;
    
  }
  

}