var http = require('http')
var url = require('url')
var fs = require('fs')
var qs = require('querystring')
var mustache = require('mustache')


var model = require('./model')

var run = function(req, res) {
    var path = url.parse(req.url, true).pathname
    var m = req.method
    var p = path.split('/').filter(x => x.length)

    console.log(m, p)

    if(p.length == 0) {
        controller['index'](req, res)
    }
    else if(m == 'GET' && p[0] == 'login') {
        controller['login_get'](req, res)
    }
    else if(m == 'POST' && p[0] == 'login') {
        controller['login_post'](req, res)
    }
    else if(m == 'GET' && p[0] == 'register') {
        controller['register_get'](req, res)
    }
    else if(m == 'POST' && p[0] == 'register') {
        controller['register_post'](req, res)
    }
    else if(m == 'GET' && p[0] == 'machines') {
        controller['machines_get'](req, res)
    }
    else if(m == 'POST' && p[0] == 'machines') {
        controller['register_post'](req, res)
    }
    else if(m == 'GET' && p[0] == 'assets') {
        controller['assets'](req, res)
    }
    else {
        controller['404'](req, res)
    }
}

var parse_body = function(req, next){
    var body = '';

    req.on('data', function (data) {
        body += data;
        if (body.length > 10 * 1024) req.connection.destroy();
    })
    req.on('end', function () {
        req.body = JSON.parse(JSON.stringify(qs.parse(body)))
        next(req)
    })
}

var controller = {}

controller['index'] = function(req, res) {
    res.writeHead(301, {'Location': '/login'})
    res.end()
}

controller['404'] = function(req, res) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('404')
}

controller['login_get'] = function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    fs.readFile('./templates/login.html', 'utf-8', function(err, data){
        if(err) return console.log("Error reading:", err.message)
        res.end(mustache.to_html(data, []))
    })
}

controller['login_post'] = function(req, res) {
    model.user.login(req.body.username, req.body.password, function(msg){
        res.writeHead(200, {'Content-Type': 'text/html'});

        fs.readFile('./templates/login.html', 'utf-8', function(err, data){
            if(err) return console.log("Error reading:", err.message)
            res.end(mustache.to_html(data, msg))
        })
    })
}

controller['register_get'] = function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    fs.readFile('./templates/register.html', 'utf-8', function(err, data){
        if(err) return console.log("Error reading:", err.message)
        res.end(mustache.to_html(data, []))
    })
}

controller['register_post'] = function(req, res) {
    model.user.register(req.body.username, req.body.password, req.body.cpassword, function(msg){
        res.writeHead(200, {'Content-Type': 'text/html'});

        fs.readFile('./templates/register.html', 'utf-8', function(err, data){
            if(err) return console.log("Error reading:", err.message)
            res.end(mustache.to_html(data, msg))
        })
    })
}

controller['machines_get'] = function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    fs.readFile('./templates/machines.html', 'utf-8', function(err, data){
        if(err) return console.log("Error reading:", err.message)
        res.end(data);
    })
}

controller['assets'] = function(req, res) {
    var path = url.parse(req.url, true).pathname

    var ctype = 'application/javascript'

    if(path.substr(-4) == '.css') {
        ctype = 'text/css'
    }

    res.writeHead(200, {'Content-Type': ctype});

    fs.readFile('./templates/' + path, 'utf-8', function(err, data){
        if(err){
            controller['404'](req, res)
            return console.log("Error reading:", err.message)
        }

        res.end(data);
    })
}




module.exports = {
    run: function(req, res){
        parse_body(req, function(req){
            run(req, res)
        })
    }
}
