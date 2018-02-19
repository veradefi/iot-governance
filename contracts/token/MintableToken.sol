pragma solidity ^0.4.11;


import './ERC827/ERC827Token.sol';
import '../admin/Administered.sol';



/**
 * @title Mintable token
 * @dev Simple ERC20 Token example, with mintable token creation
 * @dev Issue: * https://github.com/OpenZeppelin/zeppelin-solidity/issues/120
 * Based on code by TokenMarketNet: https://github.com/TokenMarketNet/ico/blob/master/contracts/MintableToken.sol
 */

contract MintableToken is ERC827Token, Administered {
  event Mint(address indexed to, uint256 amount);
  event MintFinished();
  event MintReopened();
  uint256 public tokenMinted;
  bool public mintingFinished = false;

  uint256 public rate; // Price per token
  
  function MintableToken(uint256 _rate) 
  public
  {
        rate=_rate;
        tokenMinted=0;
  }
  
  function setRate(uint256 _rate) 
  public
  onlyAdmin 
  returns (uint256){
        rate=_rate;
        return rate;                
  }
    
  modifier canMint() {
    require(!mintingFinished);
    _;
  }

  /**
   * @dev Function to mint tokens
   * @param _to The address that will receive the minted tokens.
   * @param _amount The amount of tokens to mint.
   * @return A boolean that indicates if the operation was successful.
   */
  function mint(address _to, uint256 _amount) 
  public
  onlyAdmin 
  canMint 
  returns (bool) 
  {

    require(_amount > 0);
    tokenMinted = tokenMinted.add(_amount);

    balances[_to] = balances[_to].add(_amount);
    Mint(_to, _amount);
    Transfer(address(0), _to, _amount);
    return true;

  }

  /**
   * @dev Function to stop minting new tokens.
   * @return True if the operation was successful.
   */
  function finishMinting() 
  public
  onlyAdmin 
  returns (bool) {
    mintingFinished = true;
    MintFinished();
    return true;
  }
  
  function reopenMinting() 
  public
  onlyAdmin 
  returns (bool) {
    mintingFinished = false;
    MintReopened();
    return true;
  }
}
