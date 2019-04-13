const sqlite3 = require('sqlite3')
const crypto = require('crypto')




const db = new sqlite3.Database('./data/main.db')
const secret_key = 'LAKSHJDOIALMRQWHNOIELUQEIW'

var create_db = function(){
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR2(32), password VARCHAR2(32))")
    db.run("CREATE TABLE IF NOT EXISTS machines (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INT, machine_name VARCHAR2(32), machine_ip VARCHAR2(15))")
}

var tokens = {}

var user = {
    check_login: function(user, pass, next) {
        user = user.trim()
        pass = pass.trim()
        var pass_hash = crypto.createHmac('sha256', secret_key).update(pass).digest('hex');

        db.all("SELECT id, username FROM users WHERE username = ? AND password = ? LIMIT 1", [user.substr(0, 32), pass_hash], (err, rows) => {
            if(err) console.log("Error querying db:", err.message)

            if(rows.length == 0) {
                return next(false)
            }
            next(true)
        });
    },
    user_exists: function(user, next) {
        db.all("SELECT id, username FROM users WHERE username = ? LIMIT 1", [user.substr(0, 32)], (err, rows) => {
            if(err){
                console.log("Error querying db:", err.message)
                return next(true)
            }

            if(rows.length > 0) {
                return next(true)
            }

            next(false)
        });
    },
    register: function(user, pass, next) {
        user = user.trim()
        pass = pass.trim()

        var pass_hash = crypto.createHmac('sha256', secret_key).update(pass).digest('hex');

        db.run("INSERT INTO users(username, password) VALUES(?, ?)", [user, pass_hash], function(err, done){
            if(err){
                console.log("Error querying db:", err.message)
                return next(false)
            }

            next(true)
        })
    }
}


create_db()
module.exports = {
    user: user,
}
