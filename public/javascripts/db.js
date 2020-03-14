var mysql = require("mysql")
var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "221107",
    database: "weixin"
})//数据库连接配置

function query(sql, attributes, callback) {
    pool.getConnection(function (err, connection) {
        connection.query(sql, attributes, function (err, rows) {
            callback(err, rows)
            connection.release()
        })
    })
}

exports.query = query