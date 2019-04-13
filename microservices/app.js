const fs = require("fs")
const http = require('http')
var url = require('url')


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
            mod.req(req, res)
        }).listen(port);

    }
    catch(e){
        console.log(`Error running service: ${e.message}.`)
    }
}

run(process.argv)
