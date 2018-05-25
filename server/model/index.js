/**
 * Created by WalkerChan on 2018/3/20.
 */

/**
 * 日期格式化
 * @param {String} fmt - 格式化类型 yyyy-MM-dd
 * @returns {String} 
 */
Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}

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
        var db = this.db,
            ops = [];
       
        db._find('books_info', {isbn13: isbn}, {_id: 0})
            .then( (data) => {

                if(String(data)) {  // 数据库存在该书数据
                    console.log(data)
                    this.formatData(data);
                    res.jsonp(data);
                    res.end();
                } else {  // 数据库无此条数据时
                    this.getBookByISBN(isbn).then( (result) => {
                        console.log(result);
                        db._insert('books_info', result)
                            .then( data => {
                                ops = data.ops;
                                this.formatData(ops);
                                console.log(ops);
                                res.jsonp(ops);
                                res.end();
                            })
                    })
                }
                // this.formatData(data);

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

        var blankReg = /\s+/g;
        value = value.replace(blankReg, ' ');

        var valueArr = value.split(' '),
            len = valueArr.length,
            json = {};

        if(len == 1) {
            console.log('len', len);
            var reg = new RegExp(value, 'ig');

            json = {
                $or: [
                    { title: reg },
                    { publisher: reg },
                    { author: reg }
                ]
            }
        }else if(len == 2) {
            console.log('len', len);
            json = {
                $or: [
                    { $and: [{title: new RegExp(valueArr[0], 'ig')}, {title: new RegExp(valueArr[1], 'ig')}] },
                    { title: new RegExp(valueArr[0], 'ig'), publisher: new RegExp(valueArr[1], 'ig') },
                    { title: new RegExp(valueArr[0], 'ig'), author: new RegExp(valueArr[1], 'ig') },
                    { $and: [{publisher: new RegExp(valueArr[0], 'ig')}, {publisher: new RegExp(valueArr[1], 'ig')}] },
                    { publisher: new RegExp(valueArr[0], 'ig'), title: new RegExp(valueArr[1], 'ig') },
                    { publisher: new RegExp(valueArr[0], 'ig'), author: new RegExp(valueArr[1], 'ig') },
                    { $and: [{author: new RegExp(valueArr[0], 'ig')}, {author: new RegExp(valueArr[1], 'ig')}] },
                    { author: new RegExp(valueArr[0], 'ig'), title: new RegExp(valueArr[1], 'ig') },
                    { author: new RegExp(valueArr[0], 'ig'), publisher: new RegExp(valueArr[1], 'ig') },
                ]
            }
        }else if(len == 3) {
            console.log('len', len);
            json = {
                $or: [
                    { $and: [{title: new RegExp(valueArr[0], 'ig')}, {title: new RegExp(valueArr[1], 'ig')}, {title: new RegExp(valueArr[2], 'ig')}] },
                    { $and: [{title: new RegExp(valueArr[0], 'ig')}, {title: new RegExp(valueArr[1], 'ig')}, {author: new RegExp(valueArr[2], 'ig')}] },
                    { $and: [{title: new RegExp(valueArr[0], 'ig')}, {title: new RegExp(valueArr[1], 'ig')}, {publisher: new RegExp(valueArr[2], 'ig')}] },
                    { $and: [{title: new RegExp(valueArr[0], 'ig')}, {author: new RegExp(valueArr[1], 'ig')}, {title: new RegExp(valueArr[2], 'ig')}] },
                    { $and: [{title: new RegExp(valueArr[0], 'ig')}, {publisher: new RegExp(valueArr[1], 'ig')}, {title: new RegExp(valueArr[2], 'ig')}] },
                    { $and: [{author: new RegExp(valueArr[0], 'ig')}, {title: new RegExp(valueArr[1], 'ig')}, {title: new RegExp(valueArr[2], 'ig')}] },
                    { $and: [{publisher: new RegExp(valueArr[0], 'ig')}, {title: new RegExp(valueArr[1], 'ig')}, {title: new RegExp(valueArr[2], 'ig')}] },
                    { $and: [{title: new RegExp(valueArr[0], 'ig')}, {author: new RegExp(valueArr[1], 'ig')}, {publisher: new RegExp(valueArr[2], 'ig')}] },
                    { $and: [{title: new RegExp(valueArr[0], 'ig')}, {publisher: new RegExp(valueArr[1], 'ig')}, {author: new RegExp(valueArr[2], 'ig')}] },
                    { $and: [{author: new RegExp(valueArr[0], 'ig')}, {title: new RegExp(valueArr[1], 'ig')}, {publisher: new RegExp(valueArr[2], 'ig')}] },
                    { $and: [{author: new RegExp(valueArr[0], 'ig')}, {publisher: new RegExp(valueArr[1], 'ig')}, {title: new RegExp(valueArr[2], 'ig')}] },
                    { $and: [{publisher: new RegExp(valueArr[0], 'ig')}, {title: new RegExp(valueArr[1], 'ig')}, {author: new RegExp(valueArr[2], 'ig')}] },
                    { $and: [{publisher: new RegExp(valueArr[0], 'ig')}, {author: new RegExp(valueArr[1], 'ig')}, {title: new RegExp(valueArr[2], 'ig')}] },
                ]
            }
        }else {
            console.log('len', len)
            json = {
                noField: 'noField'
            }
        }


        db._find('books_info', json)
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

        db._sortByRate('books_info', {avg_rate: {$exists: true}})
            .then( (data) => {
                console.log(data);
                this.formatData(data);
                res.jsonp(data);
                res.end();
            })
            .catch( (error) => {
                console.log(error);
            })
    },

    getUserInfo: function (openid, res) {
        var db = this.db;

        db._find('wx_user', {openid: openid}, {_id: 0})
            .then( data => {
                res.jsonp(data[0]);
                res.end();
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
                    console.log(data)
                    res.jsonp(data[0]);
                    res.end();
                }else {    // 不存在 插入该条数据
                    db._insert('wx_user', req.body)
                        .then( data => {
                            console.log(data.ops)
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

    /**
     * 图书详情借书接口
     * @param query - 所借书本的code_39和借书人openid
     * @param res - 响应参数
     */
    loanBook: function (query, res) {
        var db = this.db;

        var code = query.code,
            openid = query.openid;

        // 借书日期和还书日期以string类型插入数据库
        var date = new Date(),
            loanDate = new Date(date).format('yyyy-MM-dd'),
            returnDate = new Date(date);
        returnDate.setDate(date.getDate() + 30);
        returnDate = new Date(returnDate).format('yyyy-MM-dd');

        var json1 = {   // 查找并更新条件
            filter: {   // 查找条件 field必须为filter
                collection_info: {
                    $elemMatch: {     // 查询内嵌文档
                        code_39: code
                    }
                }
            },
            update: {   // 更新内容 field必须为update
                $set: {
                    'collection_info.$.state': '',
                    'collection_info.$.loan_date': loanDate,
                    'collection_info.$.return_date': returnDate,
                }
            },
            options: {   // 返回值选项 field必须为options
                projection: {   // 返回值筛选
                    _id: 0
                },
                returnOriginal: false    // 返回更新后的数据
            }
        };

        var json2 = {   // 查找并更新条件
            filter: {   // 查找条件 field必须为filter
                openid: openid
            },
            update: {   // 更新内容 field必须为update
                $push: {
                    loan_history: { code_39: code, is_rated: false },
                    loan_book: code
                }
            },
            options: {   // 返回值选项 field必须为options
                projection: {   // 返回值筛选
                    _id: 0
                },
                returnOriginal: false    // 返回更新后的数据
            }
        };

        var updateBookInfo = db._findOneAndUpdate('books_info', json1),
            updateUserInfo = db._findOneAndUpdate('wx_user', json2);

        Promise.all([updateBookInfo, updateUserInfo])
                .then( data => {
                    res.jsonp(data);
                    res.end();
                })
    },

    /**
     * 获取已借待还的书籍信息
     * @param codeArr - 已借书籍条码号数组
     * @param res - 响应参数
     */
    getLoanBookInfo: function (codeArr, res) {
        var db = this.db;
        var code_39 = {};
        var LoanBookInfoArr = [];

        codeArr = codeArr ? codeArr : [];

        if(codeArr.length > 0) {  // 判断前端传的数组是否为空
            codeArr.forEach(function (item, index) {  // 循环遍历code获取图书信息
                code_39 = {
                    'collection_info': {
                        '$elemMatch': {     // 查询内嵌文档
                            'code_39': item
                        }
                    }
                };
                db._find('books_info', code_39, {_id: 0})
                    .then( (data) => {
                        LoanBookInfoArr.push(data[0]);
                        if((codeArr.length - 1) == index) {  // 循环遍历完成后将数据返回前端
                            res.jsonp(LoanBookInfoArr);
                            res.end();
                        }
                    })
            })
        } else {
            console.log('getLoanBookInfo\'s codeArr is null');
        }
    },

    /**
     * 还书接口
     * @param query - 已借书籍的用户和书籍code_39
     * @param res - 响应参数
     */
    returnBook: function (query, res) {
        var db = this.db;

        var code = query.code,
            openid = query.openid;

        var json1 = {   // 查找并更新条件
            filter: {   // 查找条件 field必须为filter
                collection_info: {
                    $elemMatch: {     // 查询内嵌文档
                        code_39: code
                    }
                }
            },
            update: {   // 更新内容 field必须为update
                $set: {
                    'collection_info.$.state': 'collected',
                    'collection_info.$.loan_date': '',
                    'collection_info.$.return_date': '',
                }
            },
            options: {   // 返回值选项 field必须为options
                projection: {   // 返回值筛选
                    _id: 0
                },
                returnOriginal: false    // 返回更新后的数据
            }
        };

        var json2 = {   // 查找并更新条件
            filter: {   // 查找条件 field必须为filter
                openid: openid
            },
            update: {   // 更新内容 field必须为update

                $pull: {
                    loan_book: code
                },
                $push: {
                    return_book: code
                }
            },
            options: {   // 返回值选项 field必须为options
                projection: {   // 返回值筛选
                    _id: 0
                },
                returnOriginal: false    // 返回更新后的数据
            }
        };

        var updateBookInfo = db._findOneAndUpdate('books_info', json1),
            updateUserInfo = db._findOneAndUpdate('wx_user', json2);

        Promise.all([updateBookInfo, updateUserInfo])
                .then( data => {
                    res.jsonp(data);
                    res.end();
                })
    },

    /**
     * 获取已还待评价的书籍信息
     * @param {Array} codeArr - 已借书籍条码号数组
     * @param res - 响应参数
     */
    getReturnBookInfo: function (codeArr, res) {
        var db = this.db;
        var code_39 = {};
        var returnBookInfoArr = [];

        codeArr = codeArr ? codeArr : [];

        if(codeArr.length > 0) {  // 判断前端传的数组是否为空
            codeArr.forEach(function (item, index) {  // 循环遍历code获取图书信息
                code_39 = {
                    'collection_info': {
                        '$elemMatch': {     // 查询内嵌文档
                            'code_39': item
                        }
                    }
                };
                db._find('books_info', code_39, {_id: 0})
                    .then( (data) => {
                        returnBookInfoArr.push(data[0]);
                        if((codeArr.length - 1) == index) {  // 循环遍历完成后将数据返回前端
                            res.jsonp(returnBookInfoArr);
                            res.end();
                        }
                    })
            })
        } else {
            console.log('getReturnBookInfo\'s codeArr is null')
        }
    },

    /**
     * 点赞书籍接口
     * @param {Object} query - 
     * @param res - 响应参数
     */
    rateBook: function (query, res) {
        var db = this.db;

        var openid = query.openid,  // 评价人id
            code = query.code_39,  //
            isbn13 = query.isbn13, 
            rateScore = parseInt(query.rateScore),
            rateValue = query.rateValue;

        var rateDate = new Date().format('yyyy-MM-dd'); // 评价时间

        var json1 = {   // 查找并更新条件
            openid: openid,
            code_39: code,
            isbn13: isbn13,
            rate_score: rateScore,
            rate_value: rateValue,
            rate_date: rateDate
        };

        var json2 = {   // 查找并更新条件
            filter: {   // 查找条件 field必须为filter
                loan_history: {
                    $elemMatch: {     // 查询内嵌文档
                        code_39: code,
                        is_rated: false
                    }
                }
            },
            update: {   // 更新内容 field必须为update
                $set: {
                    'loan_history.$.is_rated': true,
                    'loan_history.$.rate_date': rateDate,
                    'loan_history.$.rate_score': rateScore
                },
                $pull: {
                    return_book: code
                }
            },
            options: {   // 返回值选项 field必须为options
                projection: {   // 返回值筛选
                    _id: 0
                },
                returnOriginal: false    // 返回更新后的数据
            }
        };

        var json3 = {};

        var insertBookRate = db._insert('books_rate', json1),
            updateUserInfo = db._findOneAndUpdate('wx_user', json2),
            updateBookInfo = db._findOneAndUpdate;

        // this.getAvgRate(isbn13)

        Promise.all([insertBookRate, updateUserInfo])
                .then( data => {
                    res.jsonp(data);
                    res.end();

                    return this.getAvgRate(isbn13)
                })
                .then( data => {
                    json3 = {
                        filter: {   // 查找条件 field必须为filter
                            isbn13: isbn13
                        },
                        update: {   // 更新内容 field必须为update
                            $set: {
                                avg_rate: data
                            }
                        },
                        options: {   // 返回值选项 field必须为options
                            projection: {   // 返回值筛选
                                _id: 0
                            },
                            returnOriginal: false    // 返回更新后的数据
                        }
                    }
                    return updateBookInfo('books_info', json3);
                })
                .then( data => {

                })
    },

    /**
     * 点赞书籍接口
     * @param {Object} query - 
     * @param res - 响应参数
     */
    getAvgRate: function (isbn13) {
        var db = this.db;

        var sumScore = 0,
            avgScore = 0;

        return new Promise( (resolve, reject) => {

            db._find('books_rate', {isbn13: isbn13})
            .then( (data) => {
                data.forEach( (item, index) => {
                    sumScore += item.rate_score;
                })
                avgScore = Number((sumScore / data.length).toFixed(1));
                resolve(avgScore);
            })

        })

    },

    /**
     * 获取用户借阅历史书籍信息
     * @param {Array} loanHistory - 借阅历史书籍的code数组
     * @param res - 响应参数
     */
    getLoanHistoryInfo: function (loanHistory, res) {
        var db = this.db;

        var loanHistoryArr = [];

        /* var json = {
            collection_info: {
                $elemMatch: {     // 查询内嵌文档
                    code_39: item.code_39
                }
            }
        }; */

        loanHistory = loanHistory ? loanHistory : [];

        if(loanHistory.length > 0) {  // 判断前端传的数组是否为空
            loanHistory.forEach(function (item, index) {  // 循环遍历code获取图书信息
                code_39 = {
                    'collection_info': {
                        '$elemMatch': {     // 查询内嵌文档
                            'code_39': item.code_39
                        }
                    }
                };
                db._find('books_info', code_39, {_id: 0})
                    .then( (data) => {
                        loanHistoryArr.push(data[0]);
                        if((loanHistory.length - 1) == index) {  // 循环遍历完成后将数据返回前端
                            res.jsonp(loanHistoryArr);
                            res.end();
                        }
                    })
            })
        }
    },

    /**
     * 更改用户书籍收藏数据
     * @param {Object} objFavor - 所需书籍
     * @param res - 响应参数
     */
    changeFavor: function (objFavor, res) {
        var db = this.db;

        var openid = objFavor.openid,  // 用户标识ID
            isbn = objFavor.isbn,  // 所收藏书籍的isbn
            favorFlag = objFavor.favor_flag;  // 修改后的收藏标识

        var json = {};

        if(favorFlag) {  // 收藏
            json = {   // 查找并更新条件
                filter: {   // 查找条件 field必须为filter
                    openid: openid
                },
                update: {   // 更新内容 field必须为update
                    $push: {
                        favor_book: isbn
                    }
                },
                options: {   // 返回值选项 field必须为options
                    projection: {   // 返回值筛选
                        _id: 0
                    },
                    returnOriginal: false    // 返回更新后的数据
                }
            };
        } else {  // 取消收藏
            json = {   // 查找并更新条件
                filter: {   // 查找条件 field必须为filter
                    openid: openid
                },
                update: {   // 更新内容 field必须为update
                    $pull: {
                        favor_book: isbn
                    }
                },
                options: {   // 返回值选项 field必须为options
                    projection: {   // 返回值筛选
                        _id: 0
                    },
                    returnOriginal: false    // 返回更新后的数据
                }
            };
        }

        db._findOneAndUpdate('wx_user', json)
            .then( data => {
                res.jsonp(data.value);
                res.end();
            })
    },

    /**
     * 获取用户书籍收藏数据
     * @param {Array} favorBookArr - 收藏书籍的isbn
     * @param res - 响应参数
     */
    getFavorBook: function (favorBookArr, res) {
        var db = this.db;

        var json = {  // 批量查询
            isbn13: {
                $in: favorBookArr
            }
        };

        favorBookArr = favorBookArr ? favorBookArr : [];

        if(favorBookArr.length == 0) {  // 为空时返回空数组
            res.jsonp(favorBookArr);
            res.end();
        } else {
            db._find('books_info', json, {_id: 0})
                .then( (data) => {
                    res.jsonp(data);
                    res.end();
                })
        }
    },

    /**
     * 图书推荐 1
     * 扫码进入详情后推荐
     * @param {Object} data - isbn + openid
     * @param res - 响应参数
     */
    command: function (data, res) {
        var db = this.db;

        var isbn = data.isbn,
            openid = data.openid;

        var json1 = {   // 查找并更新条件
            filter: {   // 查找条件 field必须为filter
                isbn13: isbn
            },
            update: {   // 更新内容 field必须为update
                $inc: {
                    command: 1
                }
            },
            options: {   // 返回值选项 field必须为options
                projection: {   // 返回值筛选
                    _id: 0
                },
                returnOriginal: false    // 返回更新后的数据
            }
        };

        var json2 = {   // 查找并更新条件
            filter: {   // 查找条件 field必须为filter
                openid: openid
            },
            update: {   // 更新内容 field必须为update
                $push: {
                    command: isbn
                }
            },
            options: {   // 返回值选项 field必须为options
                projection: {   // 返回值筛选
                    _id: 0
                },
                returnOriginal: false    // 返回更新后的数据
            }
        };

        var updateBookInfo = db._findOneAndUpdate('books_info', json1),
            updateUserInfo = db._findOneAndUpdate('wx_user', json2);

        Promise.all([updateBookInfo, updateUserInfo])
            .then( data => {
                this.addCommand({ openid: openid, isbn13: isbn })
                res.jsonp(data);
                res.end();
            })
    },

    /**
     * 图书推荐 2
     * 关键字搜索不到 推荐
     * @param {Object} commandObj
     */
    addCommand: function (commandObj) {
        var db = this.db;

        db._insert('command_list', commandObj);
    },

    getNews: function (req, res) {
        var db = this.db;

        db._find('lib_news', {}).then( (data) => {
            res.jsonp(data[0]);
            res.end();
        })
    }
}

module.exports = model;