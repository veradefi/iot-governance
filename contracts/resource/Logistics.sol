import "./admin/Administered.sol";
import "./ConvertLib.sol";
import "./GoodwillCoin.sol";


pragma solidity ^0.4.11; //We have to specify what version of the compiler this code will use

contract RSLogistics is Administered {
  using ConvertLib for *;
  
  SmartKey key;
  
  function RSLogistics(SmartKey _key, address[] adminAddress) 
      Administered(adminAddress)
  {
  
     key=_key;
    
  }
  
  function RequestDelivery(address rsAddress, Catalogue resource, uint _rsToken) returns (bool) {
      return true;
      
  }
  
  function ConfirmDelivery(address rsAddress, Catalogue resource, uint _rsToken) returns (bool) {
      return true;
      
  }

  function DeliveryStatus(address rsAddress) returns (bool) {
      return true;
  }
  
}