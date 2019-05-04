var {exec} = require('child_process');
var path;

var init = function(port_no){
    path = process.cwd();
}

var req = function(req, res) {

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
    })

    var command = req.body.command
    
    if (command.trim().slice(0, 2) == 'cd') {
    	process.chdir(command.trim().slice(2))
    	path = process.cwd();
    }
    else {
    	exec(command, (error, stdout, stderr) => {
    		res.end(JSON.stringify({
            	result: stdout,
            	path: path
        	}))
    	});
    }
    
}

module.exports = {
    init: init,
    req: req
}
