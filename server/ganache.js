var ganache = require("ganache-cli");
var server = ganache.server({network_id:5});
server.listen(8545, function(err, blockchain) {

});
