const sqlite3 = require('sqlite3')
const crypto = require('crypto')




const db = new sqlite3.Database('./data/main.db')
const secret_key = 'LAKSHJDOIALMRQWHNOIELUQEIW'

var token_db = {}


var create_db = function(){
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR2(32), password VARCHAR2(32))")
    db.run("CREATE TABLE IF NOT EXISTS machines (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INT, machine_name VARCHAR2(32), machine_ip VARCHAR2(15))")
}

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
            next(true, rows[0])
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

var machines = {
    get_user_machines: function(user_id, next) {
        user_id = parseInt(user_id)

        db.all("SELECT id, machine_name, machine_ip FROM machines WHERE user_id = ?", [user_id], (err, rows) => {
            if(err) {
                console.log("Error querying db:", err.message)
                return next([])
            }

            next(rows)
        });
    },
    add_machine: function(user_id, name, host, next) {
        user_id = parseInt(user_id)
        name = name.trim()
        host = host.trim()

        db.run("INSERT INTO machines(user_id, machine_name, machine_ip) VALUES(?, ?, ?)", [user_id, name, host], function(err, done){
            if(err){
                console.log("Error querying db:", err.message)
                return next(false)
            }

            next(true)
        })
    },
    del_machine: function(user_id, machine_id, next) {
        user_id = parseInt(user_id)
        machine_id = parseInt(machine_id)

        db.run("DELETE FROM machines WHERE id = ? AND user_id = ?", [machine_id, user_id], function(err, done){
            if(err){
                console.log("Error querying db:", err.message)
                return next(false)
            }

            next(true)
        })
    },
}



var token_wrap = {
    gen_token: function() {
        return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)
    },
    new_token: function(data) {
        var token = this.gen_token()
        token_db[token] = data

        return token;
    },
    check_token: function(token) {
        if(!token) return false
        if(!token_db[token]) return false
        return token_db[token];
    }
}

create_db()
module.exports = {
    user: user,
    machines: machines,
    token: token_wrap,
}
