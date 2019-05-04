var http = require('http')
var url = require('url')
var fs = require('fs')
var qs = require('querystring')
var mustache = require('mustache')


var model = require('./model')
var view = require('./view')('./templates/')

var Controller = function(){
    var routes_get = {};
    var routes_post = {};

    var run = function(req, res) {
        var path = url.parse(req.url, true).pathname.trim()
        var m = req.method

        var routes = routes_get;
        if(m == 'POST') routes = routes_post;

        for(var route in routes){
            if(RegExp('^' + route + '$').test(path)){
                return routes[route](req, res)
            }
        }

        if(Object.keys(routes_get).indexOf('404') > -1){
            return routes_get['404'](req, res)
        }

        return res.end("404")
    }

    var redir = (res, path) => {
        res.writeHead(301, {'Location': path})
        res.end()
    }

    var h_post = (route, fct) => routes_post[route] = fct
    var h_get = (route, fct) => routes_get[route] = fct
    var h_any = (route, fct) => routes_get[route] = routes_post[route] = fct

    return {
        post: h_post,
        get: h_get,
        any: h_any,
        run: run,

        redir: redir,
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

var parse_cookies = function(req) {
    var list = {}
    var chead = req.headers.cookie;

    if(chead) {
        chead.split(';').forEach(function( cookie ) {
            var parts = cookie.split('=');
            list[parts[0].trim()] = decodeURI(parts.slice(1).join('='));
        });
    }

    return list;
}


var ctr = Controller()

ctr.get('/', (req, res) => {
    ctr.redir(res, '/login')
})

ctr.get('404', (req, res) => {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('404')
})

ctr.get('/assets/.*', (req, res) => {
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
})

ctr.get('/login', (req, res) => {
    view.render(res, 'login.html')
})

ctr.get('/register', (req, res) => {
    view.render(res, 'register.html')
})

ctr.post('/login', (req, res) => {
    var user = req.body.username
    var pass = req.body.password


    model.user.check_login(user, pass, function(msg){
        if(msg === true){
            //Credentials ok
            ctr.redir(res, '/machines')
            return
        }

        view.render(res, 'login.html', {error: "Wrong username or password."})
    })
})

ctr.post('/register', (req, res) => {
    var user = req.body.username
    var pass = req.body.password
    var cpass = req.body.cpassword

    var msg = {}

    if(pass != cpass) msg.error = "Passwords don't match."
    else if(pass.length < 6) msg.error = "Password is too short."
    else if(user.length < 4) msg.error = "Username is too short."

    if(msg.error) return view.render(res, 'register.html', msg)

    model.user.user_exists(user, function(exists){
        if(exists){
            return view.render(res, 'register.html', {error: "Username is already used."})
        }

        model.user.register(user, pass, function(ok){
            view.render(res, 'register.html', ok ? {success: "Successfuly registered!"} : {error: "Error inserting into db."})
        })
    })
})


ctr.get('/machines', (req, res) => {
    view.render(res, 'machines.html')
})


ctr.get('/machine/(.*)/', (req, res) => {
    view.render(res, 'control.html')
})
ctr.get('/machine/(.*)/home', (req, res) => {
    view.render(res, 'control.html')
})
ctr.get('/machine/(.*)/users', (req, res) => {
    view.render(res, 'control_users.html')
})
ctr.get('/machine/(.*)/fs', (req, res) => {
    view.render(res, 'control_fs.html')
})
ctr.get('/machine/(.*)/logs', (req, res) => {
    view.render(res, 'control_logs.html')
})
ctr.get('/machine/(.*)/console', (req, res) => {
    view.render(res, 'control_console.html')
})
ctr.get('/machine/(.*)/configs', (req, res) => {
    view.render(res, 'control_configs.html')
})
ctr.get('/machine/(.*)/processes', (req, res) => {
    view.render(res, 'control_processes.html')
})
ctr.get('/machine/(.*)/docs', (req, res) => {
    view.render(res, 'docs.html')
})




module.exports = {
    run: function(req, res){
        req.cookies = parse_cookies(req)

        parse_body(req, function(req){
            ctr.run(req, res)
        })
    }
}
