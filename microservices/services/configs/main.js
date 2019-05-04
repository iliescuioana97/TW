// IMPLEMENTEAZA

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

    res.end(JSON.stringify(
        {'all': `
        Ana are
        mere
        `,
    'enabled': `Ana are
    pere`,
'disabled': `ana are
ciocolata`,
'static': `
salut
hei
`},
    ))

}

module.exports = {
    init: init,
    req: req
}
