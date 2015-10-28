'use strict';

var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    app = express();

var port = process.env.PORT || 3000

app.get('/dobutsu_shogi.html', function(req, res){
  console.log('received GET request for dobutsu_shogi.html');
  fs.createReadStream('dobutsu_shogi.html').pipe(res);
});

app.get('/images/landscape.png', function(req, res){
  console.log('received GET request for images/landscape.png');
  fs.createReadStream('images/landscape.png').pipe(res);
})

app.get('/style.css', function(req, res){
  console.log('received GET request for style.css');
  fs.createReadStream('style.css').pipe(res);
});

var server = http.createServer(app);

console.log('Listening on port: ' + port);
server.listen(port);
