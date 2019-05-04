var fs = require('fs');


var init = function(port_no){
    // ??
}

var req = function(req, res) {
    res.writeHead(200, {
        // 'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
    })

    var lista = document.querySelectorAll("#view-logs-container .left-file-menu .log-btn")

    for (log in lista){
        var log_path = log.innerText
        console.log(log_path)
        fs.readFile(log_path, "UTF-8",  function(err, data) {
            console.log(data)
        });
    }
}

module.exports = {
    init: init,
    req: req
}
