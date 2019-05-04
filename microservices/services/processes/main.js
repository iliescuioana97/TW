var url = require('url');
var fs = require('fs');
var os = require('os');
var osu = require('os-utils');
var ps = require('ps-node');


var init = function(port_no){
    // ??
}

var req = function(req, res) {

    res.writeHead(200, {
        // 'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
    })

    ps.lookup({
        command: 'node',
        psargs: 'aux'
        }, function(err, resultList ) {
        if (err) {
            throw new Error( err );
        }

        resultList.forEach(function( process ){
            if( process ){
                console.log( 'PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments );
            }
        });
    });
})

module.exports = {
    init: init,
    req: req
}
