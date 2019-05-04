var url = require('url');
var fs = require('fs');
var os = require('os');
var osu = require('os-utils');
var {exec} = require('child_process');

var init = function(port_no){
    // ??
}

var req = function(req, res) {

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
    })
    var command_disabled = "systemctl list-unit-files --type service | grep disabled | sed -E -e 's/[[:blank:]]+/\\n/g' | grep -v disabled | tr -s '\\n'"
    var command_enabled = "systemctl list-unit-files --type service | grep enabled | sed -E -e 's/[[:blank:]]+/\\n/g' | grep -v enabled | tr -s '\\n'"
    var command_static = "systemctl list-unit-files --type service | grep static | sed -E -e 's/[[:blank:]]+/\\n/g' | grep -v static | tr -s '\\n'"

    var services_all;
    var services_enabled;
    var services_disabled;
    var services_static;

    exec(command_enabled, (err, stdout, stderr) => {
      services_enabled = stdout;

      exec(command_disabled, (err, stdout, stderr) => {
          services_disabled = stdout;

          exec(command_static, (err, stdout, stderr) => {
              services_static = stdout;

              services_all = services_enabled + services_disabled + services_static
              res.end(JSON.stringify(
                  {
                      'all': services_all,
                      'enabled': services_enabled,
                      'disabled': services_disabled,
                      'static': services_static},
              ))
        })

    })
})
}

module.exports = {
    init: init,
    req: req
}
