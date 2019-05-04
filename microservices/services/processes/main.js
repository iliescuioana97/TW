var url = require('url');
var fs = require('fs');
var os = require('os');
var osu = require('os-utils');
var psList = require("ps-list")

var init = function(port_no){
    // ??
}

var req = function(req, res) {

    res.writeHead(200, {
        // 'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
    })

    psList().then(l=>console.log(l));
}

module.exports = {
    init: init,
    req: req
}
