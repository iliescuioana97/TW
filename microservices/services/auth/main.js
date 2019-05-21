var {exec} = require('child_process');
var pam = require('authenticate-pam');
var jwt = require('jsonwebtoken');

var secret = null

var init = function(port_no, secret_c){
    secret = secret_c
}

var req = function(req, res, auth) {
    // No auth necessary here.

    if(!req.body.username || !req.body.password) {
        return res.end(JSON.stringify({
            error: "Invalid username or password."
        }))
    }

    var username = req.body.username
    var password = req.body.password

    pam.authenticate(username, password, (err) => {
        if(err) {
            return res.end(JSON.stringify({error: err}))
        }
        return res.end(JSON.stringify({
            success: "Authentication succeed.",
            token: jwt.sign({on: 1, username: username}, secret)
        }))
    })

}

module.exports = {
    init: init,
    req: req
}
