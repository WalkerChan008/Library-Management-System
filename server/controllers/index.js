/**
 * Created by WalkerChan on 2018/3/20.
 */
var express = require('express');
var model = require('../model/index');
var router = express.Router();

router.get('/code_search', function (req, res) {
    var isbn = req.query.isbn;    // 获取url'?'后传过来的参数
    model.getBooksInfoByISBN(isbn, res);
});

router.get('/value_search', function (req, res) {
    var value = req.query.value;
    model.getBooksInfoByValue(value, res);
})


module.exports = router;
