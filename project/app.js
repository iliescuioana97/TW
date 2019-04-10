var http = require('http');
var url = require('url');
var fs = require('fs');

var controller = require('./controller')

http.createServer(function(req, res) {

    controller.run(req, res)

}).listen(3001);
