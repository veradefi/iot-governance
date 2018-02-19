const SmartKey=artifacts.require('SmartKey.sol');

contract('SmartKey', function(accounts) {
  it("works", function() {
    var a = accounts[0];
    var b = accounts[1];
    var key = SmartKey.new(10000000000, web3.toWei('0.01', 'ether'), [a,b]);
    


    getBalances(coin, a, b, function() {
       key.send(b,500).then(function() {
        getBalances(coin, a, b);
       });
    })
  });
});

function getBalances(coin, a, b, cb) {
  coin.getBalanceInEth.call(a).then(function(balanceA) {
    console.log("balanceA: " + balanceA);

    coin.getBalanceInEth.call(b).then(function(balanceB) {
      console.log("balanceB: " + balanceB);
      if (cb)
        cb();
    });
  });
}
