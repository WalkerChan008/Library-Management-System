/**
 * Created by WalkerChan on 2018/3/20.
 */
model = {
    
    db: require('./mongodb.js'),

    /**
     * 通过ISBN获取图书信息
     * 通过豆瓣api获取
     * @param {String} isbn
     * @param {Object} res - 引用该方法的res对象
     */
    getBookByISBN: function (isbn, res) {
        return new Promise(function (resolve, reject) {
            var http = require('http');
            var https = require('https');
            var qs = require('querystring');

            // 请求参数
            var options = {
                hostname: 'api.douban.com',
                path: '/v2/book/isbn/' + isbn,
                method: 'get'
            };

            var req = https.request(options, function (result) {
                console.log('REQUEST_STATUS: ' + result.statusCode);
                var data = '';
                result.setEncoding('utf8');
                result.on('data', function (chunk) {
                    data += chunk;
                }).on('end', function () {
                    data = JSON.parse(data);
                    resolve(data);
                    // res.jsonp(data.title);
                    // res.end();
                });
            });

            req.on('error', function (e) {
                console.log('problem with request: ' + e.message);
            })

            req.end();
        });
    },

    /**
     * 通过关键字获取图书信息
     * 通过豆瓣api获取
     * @param {String} value
     * @param {Object} res - 引用该方法的res对象
     */
    getBookByValue: function (value, res) {
        return new Promise(function (resolve, reject) {
            var https = require('https');

            // 请求参数
            var options = {
                hostname: 'api.douban.com',
                path: '/v2/book/search?q=' + value,
                method: 'get'
            };

            var req = https.request(options, function (result) {
                console.log('REQUEST_STATUS: ' + result.statusCode);
                var data = '';
                result.setEncoding('utf8');
                result.on('data', function (chunk) {
                    data += chunk;
                }).on('end', function () {
                    data = JSON.parse(data);
                    resolve(data);
                    // res.jsonp(data.title);
                    // res.end();
                });
            });

            req.on('error', function (e) {
                console.log('problem with request: ' + e.message);
            })

            req.end();
        });
    },

    /**
     * 通过ISBN直接在数据库中查找
     * @param {String} isbn
     * @param {Object} res - 通过res将数据传回前端
     */
    getBooksInfoByISBN: function (isbn, res) {
        var db = this.db;

        db._find('books_info', {isbn: isbn})
            .then( (data) => {
                this.formatData(data);
                res.jsonp(data);
                res.end();
            })
            .catch( (error) => {
                console.log(error);
            })
        /* this.getBookByISBN(isbn).then( (result) => {
            console.log(result);
            db._insert('books_info', result, function (err, data) {})
            data[0] = Object.assign(data[0] || {}, result);
            this.formatData(data);
            console.log(data[0]);
            res.jsonp(data);
            res.end();
        }) */
    },

    /**
     * 通过code_39直接在数据库中查找
     * @param {String} code - code_39
     * @param {Object} res - 通过res将数据传回前端
     */
    getBooksInfoByCode: function (code, res) {
        var db = this.db;

        var code_39 = {
            'collection_info': {
                '$elemMatch': {     // 查询内嵌文档
                    'code_39': code
                }
            }
        };

        db._find('books_info', code_39)
            .then( (data) => {
                /* this.getBookByISBN(data[0].isbn).then( (result) => {
                    data[0] = Object.assign(data[0] || {}, result);
                    this.formatData(data);
                    console.log(data);
                    res.jsonp(data);
                    res.end();
                }) */
                this.formatData(data);
                res.jsonp(data);
                res.end();
            })
            .catch(function (error) {
                console.log(error);
            })
    },

    /**
     * 通过关键字直接在数据库中查找
     * @param {String} value - 从前端返回的关键字
     * @param {Object} res - 通过res将数据传回前端
     */
    getBooksInfoByValue: function (value, res) {
        var db = this.db;
        
        var reg = new RegExp(value, 'ig');

        db._find('books_info', {title: reg})
            .then( (data) => {
                this.formatData(data);
                res.jsonp(data);
                res.end();
            })
            .catch( (error) => {
                console.log(error);
            })

        
        /* this.getBookByValue(value).then( (result) => {
            console.log(result);
            res.jsonp(result);
            res.end();
        }) */
    },

    /**
     * 格式化从数据库中取出的数据(删除_id字段)
     * @param {Array} data
     */
    formatData: function (data) {
        var i = 0,
            len = data.length;
        for(i; i < len; i ++) {
            delete data[i]['_id'];
            data[i]['catalog'] ? (delete data[i]['catalog']) : '';
        }
    },

    /**
     * 获取数据库中like排前10的数据
     * @param 
     */
    getHotTop10: function (res) {
        var db = this.db;

        db._sortByLike('books_info', {like: {$exists: true}})
            .then( (data) => {
                this.formatData(data);
                res.jsonp(data);
                res.end();
            })
            .catch( (error) => {
                console.log(error);
            })
    }

}

module.exports = model;