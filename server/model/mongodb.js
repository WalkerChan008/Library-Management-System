/**
 * Created by WalkerChan on 2018/3/29.
 */
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://127.0.0.1:27017/',
    dbName = 'library';

/**
 * 连接数据库
 * @param {function} callback -通过回调函数方式传入参数
 */
function connectDB(callback) {
    MongoClient.connect(url, function (err, client) {

        var db = client.db(dbName);   // mongodb 3.0版本库的使用方法     

        if(err) {
            console.log('数据库连接失败！');
            return;
        }
        callback(db);
        client.close();
    })
}

/**
 * 增删查改数据方法集
 */
var util = {

    /**
     * 查找数据
     * @param collection_name - 集合名称
     * @param json - 查询条件
     */
    _find: function (collection_name, json, projections) {
        projections = projections ? projections : {};
        return new Promise(function (resolve, reject) {
            connectDB(function (db) {
                var result = db.collection(collection_name).find(json).project(projections);
                resolve(result.toArray());
            });
        })
    },

    // 增加数据
    _insert: function (collection_name, json) {
        return new Promise(function (resolve, reject) {
            connectDB(function (db) {
                var result = db.collection(collection_name).insertOne(json);
                resolve(result);
            });
        })
        // connectDB(function (db) {
        //     db.collection(collection_name).insertOne(json, function (error, data) {
        //         callback(error, data);   // 拿到数据执行回调函数
        //     });
        // });
    },

    // 更新数据
    _update: function (collection_name, json1, json2) {
        return new Promise(function (resolve, reject) {
            connectDB(function (db) {
                var result = db.collection(collection_name).updateOne(json1, {$set: json2});
                resolve(result);
            });
        })
        // connectDB(function (db) {
        //     db.collection(collection_name).updateOne(json1, {$set: json2}, function (error, data) {
        //         callback(error, data);
        //     });
        // });
    },

    // 删除数据
    _delete: function (collection_name, json, callback) {
        connectDB(function (db) {
            db.collection(collection_name).deleteOne(json, function (error, data) {
                callback(error, data);
            });
        });
    },

    _sortByLike: function (collection_name, json) {
        return new Promise(function (resolve, reject) {
            connectDB(function (db) {
                var result = db.collection(collection_name).find(json).sort({like: -1}).limit(10);
                resolve(result.toArray());
            });
        })
    },

    _findOneAndUpdate: function (collection_name, json) {
        json.options = json.options ? json.options : {};
        return new Promise(function (resolve, reject) {
            connectDB(function (db) {
                var result = db.collection(collection_name).findOneAndUpdate(json.filter, json.update, json.options)
                resolve(result);
            });
        })
    }
}

/**
 * 暴露接口
 */
module.exports = util;
// module.exports = handle;