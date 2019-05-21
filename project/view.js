var fs = require('fs')
var mustache = require('mustache')

var Template = function(path = './templates/') {
    var render = function(res, tpl_name, vars = [], cookies = {}) {
        var head_lines = {'Content-Type': 'text/html'}

        if(cookies && Object.keys(cookies).length){
            var list = []
            for(var key in cookies){
                list.push(`${encodeURI(key)}=${encodeURI(cookies[key])}`)
            }
            head_lines['Set-Cookie'] = list.join(';')
        }
        res.writeHead(200, head_lines);

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
