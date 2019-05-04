var url = require('url');
var psList = require("ps-list")

var init = function(port_no){
    // ??
}

var req = function(req, res) {
    res.writeHead(200, {
        // 'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
    })

    psList().then(function(ps_list){
        res.end(JSON.stringify(ps_list));
    });
}

module.exports = {
    init: init,
    req: req
}
