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

        db._find('books_info', {isbn: isbn}, {_id: 0})
            .then( (data) => {
                // this.formatData(data);
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

        db._find('books_info', code_39, {_id: 0})
            .then( (data) => {
                /* this.getBookByISBN(data[0].isbn).then( (result) => {
                    data[0] = Object.assign(data[0] || {}, result);
                    this.formatData(data);
                    console.log(data);
                    res.jsonp(data);
                    res.end();
                }) */
                // this.formatData(data);
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
     * @param res - 响应参数
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
    },

    /**
     * 保存微信用户数据
     */
    saveUserInfo: function (req, res) {
        // req.body
        var db = this.db;
        var ops = {};
        db._find('wx_user', {openid: req.body.openid}, {_id: 0})
            .then( data => {
                // 判断该用户是否存在于数据库
                if(data.length > 0) {    // 存在 将该条数据返回
                    console.log('用户数据已存在！');
                    res.jsonp(data);
                    res.end();
                }else {    // 不存在 插入该条数据
                    db._insert('wx_user', req.body)
                        .then( data => {
                            console.log('新的数据插入成功！');
                            this.formatData(data.ops);
                            res.jsonp(data.ops[0]);
                            res.end();
                        })
                        .catch( error => {
                            console.log('insert error !');
                        })
                }
            })
            .catch( error => {
                console.log('find data error !')
            })
        

        /* db._insert('wx_user', req.body)
            .then( data => {
                console.log('insert success !')
            })
            .catch( error => {
                console.log('insert error !');
            }) */
    },

    /**
     * 获取图书馆读者证权限
     * @param accountInfo - 图书馆账号密码信息
     * @param res - 响应参数
     */
    getAuth: function (accountInfo, res) {
        var db = this.db;
        var json1 = {   // 查找并更新条件
            filter: {   // 查找条件 field必须为filter
                openid: accountInfo.openid,
                lib_auth: false
            },
            update: {   // 更新内容 field必须为update
                $set: {
                    lib_account: accountInfo.account,
                    lib_password: accountInfo.password,
                    lib_auth: true
                }
            },
            options: {   // 返回值选项 field必须为options
                projection: {   // 返回值筛选
                    _id: 0
                },
                returnOriginal: false    // 返回更新后的数据
            }
        };
        var json2 = {    // 读者证号密码
            account: accountInfo.account,
            password: accountInfo.password,
            used: false
        };
        console.log(json2)
        db._find('lib_user', json2, {_id: 0})
            .then( data => {
                console.log(data)
                // 前端传过来的lib账号密码与数据库匹配
                if(String(data[0]) == String(json2)) {
                    db._findOneAndUpdate('wx_user', json1)
                        .then( data => {
                            console.log(data)
                            console.log('匹配数据成功！');
                            res.jsonp(data.value);
                            res.end();
                        })
                        .catch( error => {
                            console.log('findOneAndUpdate error: ');
                            console.log(error);
                        })
                    db._update('lib_user', json2, {used: true}).then(data =>{});
                }else {
                    console.log('账号密码不匹配或账号已被使用');
                    res.jsonp();
                    res.end();
                }
            })
            .catch( error => {
                console.log(error);
            })
    },

    /**
     * 取消图书馆读者证权限
     * @param openid - 取消图书馆授权的微信用户
     * @param res - 响应参数
     */
    cancelAuth: function (openid, res) {
        var db = this.db;
        var json1 = {
            filter: {
                openid: openid,
                lib_auth: true
            },
            update: {
                $set: {
                    lib_auth: false
                }
            },
            options: {
                projection: {
                    _id: 0
                },
                returnOriginal: false
            }
        };
        var json2 = {};
        db._findOneAndUpdate('wx_user', json1)
            .then( data => {
                json2 = {
                    account: data.value.lib_account,
                    password: data.value.lib_password,
                    used: true
                };
                db._update('lib_user', json2, {used: false}).then(data =>{});
                console.log('cancelAuth');
                res.jsonp(data.value);
                res.end();
            })
    },

    loanBook: function (code, res) {

    }

}

module.exports = model;