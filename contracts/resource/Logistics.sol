import "../admin/Administered.sol";
import "../SmartKey.sol";
import "../Catalogue.sol";


pragma solidity ^0.4.11; //We have to specify what version of the compiler this code will use

contract Logistics is Administered {
  
  SmartKey key;
  
  function Logistics(SmartKey _key, address[] adminAddress) 
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