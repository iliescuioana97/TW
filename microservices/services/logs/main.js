var fs = require('fs');


var init = function(port_no){
    // ??
}

var req = function(req, res, auth) {
    if(!auth) return res.end(JSON.stringify({error: "Not authed."}))

    var log_path = req.body.log;
    fs.readFile(log_path, "UTF-8",  function(err, data) {
        res.end(JSON.stringify({
            log_data: data
        }))
    });
}

module.exports = {
    init: init,
    req: req
}
