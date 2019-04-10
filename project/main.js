var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    var path = q.pathname
    var paths = path.split('/').filter(x => x.trim().length)
    console.log(req.method)
    if(paths[0] == 'assets') {
        var content_type = 'text/css'

        if(path.substr(-3) == '.js') {
            var content_type = 'application/javascript'
        }

        res.writeHead(200, {'Content-Type': content_type});

        fs.readFile('../elemente_front_end/all_migrated' + path, 'utf-8', function(err, data){
            if(err){
                console.log('../elemente_front_end/all_migrated' + path)
                console.log(err)
                res.end("Eroare, nene!")
                return
            }
            res.end(data);
        })
        return
    }

    res.writeHead(200, {'Content-Type': 'text/html'});

    var file = '../elemente_front_end/all_migrated/login.html'

    if(!paths.length || paths[0] == 'login') {
        // ok
    }
    else if(paths[0] == 'register') {
        var file = '../elemente_front_end/all_migrated/register.html'
    }
    else if(paths[0] == 'machines') {
        var file = '../elemente_front_end/all_migrated/machines.html'
    }
    else if(paths[0] == 'control') {
        var file = '../elemente_front_end/all_migrated/control.html'
    }


    fs.readFile(file, 'utf-8', function(err, data){
        res.end(data);
    })
}).listen(8080);
