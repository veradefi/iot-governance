const SmartKey=artifacts.require('SmartKey.sol');

contract('SmartKey', function(accounts) {
  it("works", function() {
    var a = accounts[0];
    var b = accounts[1];
    var key = SmartKey.new(10000000000, web3.toWei('0.01', 'ether'), [a,b]);
    


  });
});

