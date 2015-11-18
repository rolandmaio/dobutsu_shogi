'use strict';

var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    app = express(),
    log4js = require('log4js'),
    morgan = require('morgan');

log4js.configure('./config/log4js_server.js.json');
var port = process.env.PORT || 3000,
    logger = log4js.getLogger(__filename);

logger.info('Spinning up the server!');

app.set('views', __dirname);
app.set('view engine', 'jade');
app.use(morgan(process.env.MORGAN_FMT));

app.get('/', function(req, res){
  logger.debug('Entering GET / route');
  logger.debug('Rendering index.jade');
  res.render('index.jade');
});

app.get('/images/landscape.png', function(req, res){
  logger.debug('Entering GET /images/landscape.png');
  res.writeHead(200, {'Content-Type': 'image/png'})
  fs.createReadStream('assets/images/landscape.png').pipe(res);
})

app.get('/images/earthChick.png', function(req, res){
  logger.debug('Entering GET /images/earthChick.png');
  res.writeHead(200, {'Content-Type': 'image/png'})
  fs.createReadStream('assets/images/EarthChick125.png').pipe(res);
})
app.get('/images/earthHen.png', function(req, res){
  logger.debug('Entering GET /images/earthHen.png');
  res.writeHead(200, {'Content-Type': 'image/png'})
  fs.createReadStream('assets/images/EarthChick125.png').pipe(res);
})
app.get('/images/earthElephant.png', function(req, res){
  logger.debug('Entering GET /images/earthElephant.png');
  res.writeHead(200, {'Content-Type': 'image/png'})
  fs.createReadStream('assets/images/EarthElephant125px.png').pipe(res);
})
app.get('/images/earthGiraffe.png', function(req, res){
  logger.debug('Entering GET /images/earthGiraffe.png');
  res.writeHead(200, {'Content-Type': 'image/png'})
  fs.createReadStream('assets/images/EarthGiraffe125px.png').pipe(res);
})
app.get('/images/earthLion.png', function(req, res){
  logger.debug('Entering GET /images/earthLion.png');
  res.writeHead(200, {'Content-Type': 'image/png'})
  fs.createReadStream('assets/images/EarthLion125px.png').pipe(res);
})
app.get('/images/skyChick.png', function(req, res){
  logger.debug('Entering GET /images/skyChick.png');
  res.writeHead(200, {'Content-Type': 'image/png'})
  fs.createReadStream('assets/images/SkyChick125.png').pipe(res);
})
app.get('/images/skyHen.png', function(req, res){
  logger.debug('Entering GET /images/skyHen.png');
  res.writeHead(200, {'Content-Type': 'image/png'})
  fs.createReadStream('assets/images/EarthChick125.png').pipe(res);
})
app.get('/images/skyElephant.png', function(req, res){
  logger.debug('Entering GET /images/skyElephant.png');
  res.writeHead(200, {'Content-Type': 'image/png'})
  fs.createReadStream('assets/images/SkyElephant125px.png').pipe(res);
})
app.get('/images/skyGiraffe.png', function(req, res){
  logger.debug('Entering GET /images/skyGiraffe.png');
  res.writeHead(200, {'Content-Type': 'image/png'})
  fs.createReadStream('assets/images/SkyGiraffe125px.png').pipe(res);
})
app.get('/images/skyLion.png', function(req, res){
  logger.debug('Entering GET /images/skyLion.png');
  res.writeHead(200, {'Content-Type': 'image/png'})
  fs.createReadStream('assets/images/SkyLion125px.png').pipe(res);
})

var server = http.createServer(app);

logger.info('Docking on port: ' + port + '!');
server.listen(port);
