var fs = require('fs');


var init = function(port_no){
    // ??
}

var req = function(req, res) {
    res.writeHead(200, {
        // 'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
    })

    fs.readFile('/var/log/alternatives.log', function(err, data) {
        console.log(data)
    });
}

module.exports = {
    init: init,
    req: req
}
