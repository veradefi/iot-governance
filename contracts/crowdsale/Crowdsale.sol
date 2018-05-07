pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use


import '../SmartKey.sol';

import '../math/SafeMath.sol';

/**
 * @title Crowdsale 
 */
contract Crowdsale is Administered {
  using SafeMath for uint256;

  // The token being sold
  SmartKey public token;

  // start and end timestamps where investments are allowed (both inclusive)
  uint256 public startTime;
  uint256 public endTime;

  // how many token units a buyer gets per wei
  uint256 public rate;

  // amount of raised money in wei
  uint256 public weiRaised;

  
  /**
   * event for token purchase logging
   * @param purchaser who paid for the tokens
   * @param beneficiary who got the tokens
   * @param value weis paid for purchase
   * @param amount amount of tokens purchased
   */ 
  event SmartKeyPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);


  function Crowdsale(SmartKey _token, uint256 _startTime, uint256 _endTime, uint256 _rate, address[] adminAddress) 
  public
  Administered(adminAddress)
  {
    require(_endTime >= _startTime);
    require(_rate > 0);
    require(admins[0] != 0x0);

    token = _token;
    startTime = _startTime;
    endTime = _endTime;
    rate = _rate;
    
  }

  function getNow() public
  view
  returns (uint256) {
      return now;
  }
  
  function getTokensMinted() 
  public
  view
  returns (uint256) {
      return token.tokenMinted();
  }
  
  function setRate(uint256 _rate) 
  public
  onlyAdmin 
  returns (uint256){
        token.setRate(_rate);
        rate=_rate;
        return rate;                
  }

  function extendEndTime(uint256 _endTime) 
  public
  onlyAdmin 
  returns (uint256){
        endTime = _endTime;
        return endTime;                
  }
  
  // fallback function can be used to buy tokens
  function () 
  public
  payable {
  
    addSmartKey(msg.sender);
    
  }

  // low level token purchase function
  function addSmartKey(address beneficiary) 
  public
  payable 
  {
  
    require(beneficiary != 0x0);
    
    uint256 weiAmount = msg.value;

    // calculate token amount to be created
    uint256 tokens = convertToToken(weiAmount);
    
    // update state
    weiRaised = weiRaised.add(weiAmount);
    
    token.addSmartKey.value(msg.value)(beneficiary, "CrowdSale");
        
    SmartKeyPurchase(msg.sender, beneficiary, weiAmount, tokens);
    
  }

  function convertToWei(uint256 amount) 
  public
  view
  returns (uint256)
  {
		return amount.mul(rate);
  }

  function convertToToken(uint256 amount) 
  public
  view
  returns (uint256)
  {
		return amount.div(rate);
  }

  // @return true if crowdsale event has ended
  function hasEnded() 
  public 
  constant 
  returns (bool) {
    return now > endTime;
  }


}
