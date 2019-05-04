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
        try {
            var tptnew = command.trim().slice(3).trim()
            if(tptnew.length == 0){
                tptnew = '~'
            }
        	process.chdir(tptnew)

        }
        catch(e){
            return res.end(JSON.stringify({
                result: e.message,
                path: path
            }))
        }

    	path = process.cwd();
        res.end(JSON.stringify({
            result: 'Changed directory to ' + path,
            path: path
        }))
    }
    else {
    	exec(command, (error, stdout, stderr) => {
            if(error){
        		return res.end(JSON.stringify({
                	result: error.message,
                	path: path
            	}))
            }

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
