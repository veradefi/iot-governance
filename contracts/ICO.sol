pragma solidity ^0.4.11;

import "./crowdsale/CappedCrowdsale.sol";
import "./crowdsale/Crowdsale.sol";
import "./admin/Administered.sol";

/**
 * @title IoT Smart Keys IO
 */
contract ICO is CappedCrowdsale {

  function ICO(SmartKey _token, uint256 _startTime, uint256 _endTime, uint256 _rate, uint256 _cap, uint256 _mintedTokens, address[] adminAddress)
  public
  Administered(adminAddress)
  CappedCrowdsale(_cap, adminAddress)
  Crowdsale(_token, _startTime, _endTime, _rate, _mintedTokens, adminAddress)
  {
    
  }

}