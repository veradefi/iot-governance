import "./admin/Administered.sol";
import "./SmartKey.sol";
import "./MetaData.sol";
pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

contract NodeMetaData is Administered {
       
  //PAS 212:2016
  MetaData[] public meta;
  mapping (bytes32 => MetaData) public itemMetaData; // rel is hashed to bytes32 data   
  //PAS 212:2016
  
  SmartKey public smartKey;

  function NodeMetaData(SmartKey _smartKey, address[] adminAddress) 
  public
  Administered(adminAddress)
  {
      smartKey=_smartKey;  
  }

  function getSmartKey()
  constant
  public
  returns (SmartKey)
  {
      return smartKey;
  }

  function selectMetaData() 
  constant
  public
  returns (MetaData[]) 
  {
         return meta;
  }

  
  function upsertMetaData(string _rel, string _val) 
  public
  payable
  returns (bool)
  {
  
      Key key=smartKey.getSmartKey(msg.sender);
      bytes32 hashVal=key.getHash(_rel);
      MetaData data;
      if (itemMetaData[hashVal] == address(0)) {
            address[] storage _admins=admins;
            _admins.push(address(this));
            _admins.push(msg.sender);
            data = new MetaData(smartKey, admins, _rel);
            itemMetaData[hashVal]=data;
            meta.push(data);
      } else {
            data = itemMetaData[hashVal];
      }
      
      smartKey.addSmartKey.value(msg.value)(address(this));

      return data.setVal(_val);
  }
 
}