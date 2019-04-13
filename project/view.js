var fs = require('fs')
var mustache = require('mustache')

var Template = function(path = './templates/') {
    var render = function(res, tpl_name, vars = []) {

        res.writeHead(200, {'Content-Type': 'text/html'});

        fs.readFile(path + tpl_name, 'utf-8', function(err, data){
            if(err) return console.log("Error reading:", err.message)

            res.end(mustache.to_html(data, vars))
        })
    }

    return {
        render: render
    }
}


module.exports = Template
