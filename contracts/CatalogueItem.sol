import "./admin/Administered.sol";
import "./Catalogue.sol";
import "./SmartKey.sol";
import "./MetaData.sol";


pragma solidity ^0.4.11; //We have to specify what version of the compiler this code will use

contract CatalogueItem is Administered {
       
  //PAS 212:2016
  string public href;
  MetaData[] public meta;
  mapping (bytes32 => MetaData) public itemMetaData; // rel is hashed to bytes32 data   
  //PAS 212:2016

  //Catalogue public parentCatalogue;
  //Catalogue[] public childCatalogue;
  
  SmartKey smartKey;

  function CatalogueItem(SmartKey _smartKey, address[] adminAddress) 
  public
  Administered(adminAddress)
  {
      smartKey=_smartKey;  
  }


  function selectHref() 
  constant
  public
  returns (bytes) 
  {
         return bytes(href);
  }

  function selectMetaData() 
  constant
  public
  returns (MetaData[]) 
  {
         return meta;
  }

  function setHref(string _href) 
  public
  payable
  returns (bool)
  {
      smartKey.getSmartKey.value(msg.value)(address(this));
      
      href=_href;
      return true;      
  }

  
  function upsertMetaData(string _rel, string _val) 
  public
  payable
  returns (bool)
  {
      Key key=smartKey.getKey(msg.sender);
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
      return data.setVal.value(msg.value)(_val);
  }
 
}