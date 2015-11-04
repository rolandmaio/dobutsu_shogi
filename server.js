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

var server = http.createServer(app);

logger.info('Docking on port: ' + port + '!');
server.listen(port);
