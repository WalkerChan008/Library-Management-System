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
                res.jsonp(data.title);
                res.end();
            });
        });

        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
        })

        req.end();
    },

    /**
     * 通过ISBN直接在数据库中查找
     * @param {String} isbn
     * @param {Object} res - 通过res将数据传回前端
     */
    getBooksInfoByISBN: function (isbn, res) {
        var self = this;
        var db = self.db;

        db._find('books_info', {isbn: isbn}, function (error, data) {
            if(error) {
                console.log('获取数据失败！');
                return;
            }
            
            self.formatData(data);
            res.jsonp(data);
            res.end();
        });
    },

    getBooksInfoByValue: function (value, res) {
        var self = this;
        var db = self.db;
        
        var reg = new RegExp(value, 'ig');

        db._find('books_info', {title: reg}, function (error, data) {
            if(error) {
                console.log('获取数据失败！');
                return;
            }

            self.formatData(data);
            res.jsonp(data);
            res.end();
        });
    },

    /**
     * 格式化从数据库中取出的数据(删除_id字段)
     * @param {Array}
     */
    formatData: function (data) {
        var i = 0,
            len = data.length;
        for(i; i < len; i ++) {
            delete data[i]['_id'];
        }
    }

}

module.exports = model;