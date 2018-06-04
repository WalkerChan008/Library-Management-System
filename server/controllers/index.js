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
    var query = req.query;
    model.getBooksInfoByValue(query, res);
});

router.get('/book_hot', function (req, res) {
    model.getHotTop10(res);
});

router.get('/getUserInfo', function (req, res) {
    model.getUserInfo(req.query.openid, res);
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
    model.loanBook(req.query, res);
});

router.post('/getLoanBookInfo', function (req, res) {
    var codeArr = req.body.codeArr;
    model.getLoanBookInfo(codeArr, res);
});

router.get('/returnBook', function (req, res) {
    model.returnBook(req.query, res);
});

router.post('/getReturnBookInfo', function (req, res) {
    var codeArr = req.body.codeArr;
    model.getReturnBookInfo(codeArr, res);
});

router.get('/rateBook', function (req, res) {
    model.rateBook(req.query, res);
    // console.log(req.query)
});

router.post('/getLoanHistoryInfo', function (req, res) {
    var loanHistory = req.body.loanHistory;
    console.log(loanHistory);
    model.getLoanHistoryInfo(loanHistory, res);
});

router.post('/changeFavor', function (req, res) {
    var objFavor = req.body;
    model.changeFavor(objFavor, res);
});

router.post('/getFavorBook', function (req, res) {
    var favorBookArr = req.body;
    model.getFavorBook(favorBookArr, res);
});

router.get('/command', function (req, res) {
    model.command(req.query, res);
});

router.post('/addCommand', function (req, res) {
    var commandObj = req.body;
    model.addCommand(commandObj);
});

router.get('/getNews', function (req, res) {
    model.getNews(req, res);
});

router.get('/showBookRate', function (req, res) {
    var isbn = req.query.isbn;
    model.showBookRate(isbn, res);
});

router.get('/showAllRate', function (req, res) {
    var query = req.query;
    model.showAllRate(query, res);
});





module.exports = router;
