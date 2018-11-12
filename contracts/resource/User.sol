import "./Network.sol";
import "../SmartKey.sol";
pragma solidity ^0.4.11; //We have to specify what version of the compiler this code will use

contract User {
  
  SmartKey key;
  Network rsNetwork;
  
  function User(SmartKey _key, Network _rsNetwork) {
      key=_key;
      rsNetwork=_rsNetwork;
  }

  function RequestUse(address rsAddress, bytes32 rsType, uint256 _startTime, uint256 _endTime, uint256 _rate) {
      
  }

  function EndUse(address rsAddress, bytes32 rsType, uint256 _endTime) {
      
  }

  function GetUsage(address rsAdress) {
  }
  



}              