import "./admin/Administered.sol";
import "./SmartKey.sol";


pragma solidity ^0.4.11; //We have to specify what version of the compiler this code will use

contract Database is Administered {
       
  SmartKey smartKey;
  
  function Database(SmartKey _smartKey, address[] adminAddress) 
  public
  Administered(adminAddress)
  {
      smartKey=_smartKey;
    
  }
  
  function insert() 
  public
  pure
  returns (bool) {
          return true;
  }


  function select() 
  public
  pure
  returns (bool) {
          return true;
  }


}