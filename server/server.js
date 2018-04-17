/**
 * Created by WalkerChan on 2018/3/17.
 */
var express = require('express');
var app = express();
var bodyParse = require('body-parser');

// var db = require('./model/mongodb.js');

var port = process.env.port || 80;


app.use(express.static('public'));
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended: true}));
app.use(require('./controllers/index'));

app.listen(port, function (){
  console.log('listen to port: ' + port);
})