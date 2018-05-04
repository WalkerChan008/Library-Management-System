/**
 * Created by WalkerChan on 2018/3/20.
 */
var express = require('express');
var model = require('../model/index');
var router = express.Router();

router.get('/isbn_search', function (req, res) {
    var isbn = req.query.isbn;    // 获取url参数
    model.getBooksInfoByISBN(isbn, res);
});

router.get('/code_search', function (req, res) {
    var code = req.query.code;    // 获取url参数
    model.getBooksInfoByCode(code, res);
});

router.get('/value_search', function (req, res) {
    var value = req.query.value;
    model.getBooksInfoByValue(value, res);
});

router.get('/book_hot', function (req, res) {
    model.getHotTop10(res);
});

router.post('/saveUserInfo', function (req, res) {
    model.saveUserInfo(req, res);
});

router.get('/getAuth', function (req, res) {
    var accountInfo = {
        openid: req.query.openid,
        account: req.query.account,
        password: req.query.password
    }
    model.getAuth(accountInfo, res);
});

router.get('/cancelAuth', function (req, res) {
    var openid = req.query.openid;
    model.cancelAuth(openid, res);
});


router.get('/loan_book', function (req, res) {
    var code = req.query.b_code;
    model.loanBook(code, res);
});


module.exports = router;
