var url = require('url')
var exec = require('child_process').exec

var init = function(port_no){
    // ??
}

var req = function(req, res, auth) {
    if(!auth) return res.end(JSON.stringify({error: "Not authed."}))

    exec('cat /etc/passwd | grep "/home/"', (err, stdout, stderr) => {
        if(err) {
            return res.end(JSON.stringify({error: err.message}))
        }

        var users = stdout.trim().split("\n").filter(x => x.indexOf('/bash') > -1 || x.indexOf('/sh') > -1).map(x => x.trim())
        var users_d = users.map(x => x.split(":"))

        var user_list = [];

        for(let user of users_d){
            user_list.push({
                'username': user[0],
                'id': user[2],
                'name': user[4].replace(/,*$/, ''),
                'home': user[5],
                'shell': user[6],
            })
        }
        res.end(JSON.stringify({users: user_list}))
    })
}

module.exports = {
    init: init,
    req: req
}
