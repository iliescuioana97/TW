var url = require('url');
var psList = require("ps-list")

var init = function(port_no){
    // ??
}

var req = function(req, res, auth) {
    if(!auth) return res.end(JSON.stringify({error: "Not authed."}))

    psList().then(function(ps_list){
        res.end(JSON.stringify(ps_list));
    });
}

module.exports = {
    init: init,
    req: req
}
