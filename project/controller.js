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

    var gen_cookies = function(cookies) {
        var cookie_list = [];

        for(let key in cookies) {
            cookie_list.push(`${encodeURIComponent(key)}=${encodeURIComponent(cookies[key])}`)
        }

        return cookie_list.join(';')
    }

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

    var redir = (res, path, cookies = false) => {
        var objd = {
            'Location': path
        }

        if(cookies && Object.keys(cookies).length) {
            objd['Set-Cookie'] = gen_cookies(cookies)
        }

        res.writeHead(301, objd)
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

        var cookies = {}
        if(req.headers.cookie) {
            var cookie_list = req.headers.cookie.split(";")
            cookie_list.map(x => {
                var parts = x.split("=")
                cookies[decodeURIComponent(parts[0])] = parts[1] ? decodeURIComponent(parts[1]) : null;
            })
        }

        req.cookies = cookies
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


    model.user.check_login(user, pass, function(msg, data){
        if(msg === true){
            //Credentials ok
            console.log("Logged in:", data)
            var token = model.token.new_token({
                user_id: data.id,
                username: data.username,
            });

            ctr.redir(res, '/machines', {token: token})
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
    if(!model.token.check_token(req.cookies.token)) return ctr.redir(res, '/login')

    view.render(res, 'machines.html')
})

ctr.get('/machines/get', (req, res) => {
    if(!model.token.check_token(req.cookies.token)) {
        return res.end(JSON.stringify({error: "Please relogin."}))
    }

    var sess = model.token.check_token(req.cookies.token)

    model.machines.get_user_machines(sess.user_id, function(list) {
        return res.end(JSON.stringify({machines: list}))
    })
})

ctr.post('/machines/add', (req, res) => {
    if(!model.token.check_token(req.cookies.token)) {
        return res.end(JSON.stringify({error: "Please relogin."}))
    }

    var sess = model.token.check_token(req.cookies.token)
    var host = req.body.host.trim()
    var name = req.body.name.trim()

    if(name.length == 0) {
        return res.end(JSON.stringify({error: "Name cannot be empty."}))
    }
    if(host.length == 0) {
        return res.end(JSON.stringify({error: "Host cannot be empty."}))
    }

    model.machines.add_machine(sess.user_id, name, host, function(ok) {
        if(ok === false) {
            return res.end(JSON.stringify({error: "Error adding machine."}))
        }

        res.end(JSON.stringify({success: "Machine added."}))
    })
})

ctr.post('/machines/del', (req, res) => {
    if(!model.token.check_token(req.cookies.token)) {
        return res.end(JSON.stringify({error: "Please relogin."}))
    }

    var sess = model.token.check_token(req.cookies.token)
    var machine_id = parseInt(req.body.machine_id)

    model.machines.del_machine(sess.user_id, machine_id, function(ok) {
        if(ok === false) {
            return res.end(JSON.stringify({error: "Error deleting machine."}))
        }

        res.end(JSON.stringify({success: "Machine deleted."}))
    })
})




ctr.get('/machine/(.*)/', (req, res) => {
    if(!model.token.check_token(req.cookies.token)) return ctr.redir(res, '/login')
    var id = parseInt(req.url.split('machine/').slice(1)[0].split('/')[0])

    view.render(res, 'control.html', {machine_id: "machine_" + id})
})
ctr.get('/machine/(.*)/home', (req, res) => {
    if(!model.token.check_token(req.cookies.token)) return ctr.redir(res, '/login')
    var id = parseInt(req.url.split('machine/').slice(1)[0].split('/')[0])

    view.render(res, 'control.html', {machine_id: "machine_" + id})
})
ctr.get('/machine/(.*)/users', (req, res) => {
    if(!model.token.check_token(req.cookies.token)) return ctr.redir(res, '/login')
    var id = parseInt(req.url.split('machine/').slice(1)[0].split('/')[0])

    view.render(res, 'control_users.html', {machine_id: "machine_" + id})
})
ctr.get('/machine/(.*)/fs', (req, res) => {
    if(!model.token.check_token(req.cookies.token)) return ctr.redir(res, '/login')
    var id = parseInt(req.url.split('machine/').slice(1)[0].split('/')[0])

    view.render(res, 'control_fs.html', {machine_id: "machine_" + id})
})
ctr.get('/machine/(.*)/logs', (req, res) => {
    if(!model.token.check_token(req.cookies.token)) return ctr.redir(res, '/login')
    var id = parseInt(req.url.split('machine/').slice(1)[0].split('/')[0])

    view.render(res, 'control_logs.html', {machine_id: "machine_" + id})
})
ctr.get('/machine/(.*)/console', (req, res) => {
    if(!model.token.check_token(req.cookies.token)) return ctr.redir(res, '/login')
    var id = parseInt(req.url.split('machine/').slice(1)[0].split('/')[0])

    view.render(res, 'control_console.html', {machine_id: "machine_" + id})
})
ctr.get('/machine/(.*)/configs', (req, res) => {
    if(!model.token.check_token(req.cookies.token)) return ctr.redir(res, '/login')
    var id = parseInt(req.url.split('machine/').slice(1)[0].split('/')[0])

    view.render(res, 'control_configs.html', {machine_id: "machine_" + id})
})
ctr.get('/machine/(.*)/processes', (req, res) => {
    if(!model.token.check_token(req.cookies.token)) return ctr.redir(res, '/login')
    var id = parseInt(req.url.split('machine/').slice(1)[0].split('/')[0])

    view.render(res, 'control_processes.html', {machine_id: "machine_" + id})
})
ctr.get('/machine/(.*)/docs', (req, res) => {
    if(!model.token.check_token(req.cookies.token)) return ctr.redir(res, '/login')
    var id = parseInt(req.url.split('machine/').slice(1)[0].split('/')[0])

    view.render(res, 'control_docs.html', {machine_id: "machine_" + id})
})




module.exports = {
    run: function(req, res){
        req.cookies = parse_cookies(req)

        parse_body(req, function(req){
            ctr.run(req, res)
        })
    }
}
