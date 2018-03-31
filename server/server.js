/**
 * Created by WalkerChan on 2018/3/17.
 */
var express = require('express');
var app = express();
var bodyParse = require('body-parser');

// var db = require('./model/mongodb.js');

var port = process.env.port || 80;


app.use('./public', express.static(__dirname + '/public'));
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended: true}));
app.use(require('./controllers/index'));

// db._find('books_info', {isbn: '9787121266775'}, function (error, data) {
//   if(error) {
//     console.log('获取数据失败！');
//     return;
//   }
//   console.log(data);
// });

app.listen(port, function (){
  console.log('listen to port: ' + port);
})