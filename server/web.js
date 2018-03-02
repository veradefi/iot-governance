var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../build/index.html'));
});

app.get('/app.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/../build/app.js'));
});


function dappRoute(req, res, next) {
    res.sendFile(path.join(__dirname + '/../build/pas212.html'));
}

app.get("/cat*", dappRoute);

app.listen(8080);
