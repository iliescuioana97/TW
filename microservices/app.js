const fs = require("fs")
const http = require('http')
const url = require('url')
const qs = require('querystring')


var run = function(argv) {
    const services_path = './services/'


    if(argv.length < 4) {
        console.log("Error: Please type the mircoservice to open name and the port to run on.")
        process.exit()
    }
    var service_name = argv[2]
    var port = parseInt(argv[3])

    if(!fs.existsSync(services_path + service_name + '/main.js')){
        console.log(`Error: Cannot find any service with this name (${service_name}).`)
        process.exit()
    }

    var mod = require(services_path + service_name + '/main')

    try {
        console.log(`Starting service: ${service_name}:${port}`)
        mod.init()

        http.createServer(function(req, res) {
            parse_body(req, function(req){
                mod.req(req, res)
            })
        }).listen(port);

    }
    catch(e){
        console.log(`Error running service: ${e.message}.`)
    }
}

var parse_body = function(req, next){
    var body = '';

    req.on('data', function (data) {
        body += data;
        if (body.length > 10 * 1024) req.connection.destroy();
    })
    req.on('end', function () {
        req.body = JSON.parse(JSON.stringify(qs.parse(body)))
        next(req)
    })
}

run(process.argv)
