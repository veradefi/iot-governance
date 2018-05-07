import "./admin/Administered.sol";
import "./SmartKey.sol";
import "./MetaData.sol";
pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

contract NodeMetaData is Administered, Key {
       
  //PAS 212:2016
  MetaData[] public meta;
  mapping (bytes32 => MetaData) public itemMetaData; // rel is hashed to bytes32 data   
  //PAS 212:2016
  
  SmartKey public smartKey;

  //event MetaDataUpdate(address indexed user, address indexed metaDataContract, string rel, string val);
  
  function NodeMetaData(SmartKey _smartKey, address[] adminAddress) 
  public
  Administered(adminAddress)
  Key(_smartKey, address(this))
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
  
      smartKey.addSmartKey.value(msg.value)(address(this), "MetaDataUpdate");

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
      

      //MetaDataUpdate(msg.sender, address(this), _rel, _val);
      
      return data.setVal(_val);
  }
 
}