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

    osu.cpuUsage(cpu => {
        fs.readdir('/dev/fd/', function(err, files){
            if(err) fd_count = 0
            else fd_count = files.length

            res.end(JSON.stringify({
                memory: os.totalmem() - os.freemem(),
                file_descriptors: fd_count,
                ram_usage: (1 - os.freemem() / os.totalmem()),
                cpu_usage: cpu
            }))

        })
    })
}

module.exports = {
    init: init,
    req: req
}
