var url = require('url');
var fs = require('fs');
var os = require('os');
var osu = require('os-utils');


var init = function(port_no){
    // ??
}

var req = function(req, res) {

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
    })

    var path = req.body.path ? req.body.path : '/'

    fs.readdir(path, function(err, files){
        if (err){
            res.end(JSON.stringify({
                files: [],
                path: path
            }))
            return;
        }

        var files_types = [];

        for(var f of files){
            var is_directory = fs.lstatSync(path + '/' + f).isDirectory();
            files_types.push({
                name: f,
                dir: is_directory
            })
        }

        res.end(JSON.stringify({
            files: files_types,
            path: path
        }))
    })
}

module.exports = {
    init: init,
    req: req
}
