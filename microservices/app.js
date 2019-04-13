const fs = require("fs")


var run = function(argv) {
    const services_path = './services/'


    if(argv.length < 4) {
        console.log("Error: Please type the mircoservice to open name and the port to run on.")
        process.exit()
    }
    var service_name = argv[2]
    var port = parseInt(argv[3])

    if(!fs.existsSync(services_path + service_name + '/' + service_name + '.js')){
        console.log(`Error: Cannot find any service with this name (${service_name}).`)
        process.exit()
    }

    var mod = require(services_path + service_name + '/' + service_name)

    try {
        console.log(`Starting service: ${service_name}:${port}`)
        mod.run(port)
    }
    catch(e){
        console.log(`Error running service: ${e.message}.`)
    }
}

run(process.argv)
