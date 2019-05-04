var url = require('url');
var fs = require('fs');
var os = require('os');
var osu = require('os-utils');


var init = function(port_no){
    // ??
}

var req = function(req, res) {

    res.writeHead(200, {
        // 'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
    })

    var path = req.body.path ? req.body.path : '/'

    fs.readdir(path, function(err, files){
        res.end(JSON.stringify(files))

    })
}

module.exports = {
    init: init,
    req: req
}
