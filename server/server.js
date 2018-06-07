/**
 * Created by WalkerChan on 2018/3/17.
 */
var express = require('express');

var fs = require('fs'),
    http = require('http'),
    https = require('https');
  
var app = express();
var bodyParse = require('body-parser');

var privateKey = fs.readFileSync('./certificate/2_lib.istarmcgames.com.key', 'utf8');
var certificate = fs.readFileSync('./certificate/1_lib.istarmcgames.com_bundle.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };

var httpsServer = https.createServer(credentials, app);


// var db = require('./model/mongodb.js');

var port = process.env.port || 80;


app.use(express.static('public'));
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended: true}));
app.use(require('./controllers/index'));

app.listen(port, function (){
  console.log('listen to port: ' + port);
})

httpsServer.listen(443, function () {
  console.log('listen to port: 443');
})