var host = 'localhost'

var msv_mapping = {
    'stats': 8001,
    'processes': 8007,
}

var msv_get = function(service_name, data, next) {
    var http = new XMLHttpRequest();
    var url = 'http://' + host + ':' + msv_mapping[service_name] + '/';

    var params = [];
    for(var k in data){
        params.push(encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
    }
    params = params.join("&")

    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            var resp = http.responseText;
            try {
                resp = JSON.parse(resp)
            }
            catch(e){}
            next(resp)
        }
    }
    http.send(params);
}




var handler_home = function(){
    var mem = document.querySelector(".msv[data-msv=ram_mem]")
    var fh_count = document.querySelector(".msv[data-msv=fh_count]")
    var cpu_usage = document.querySelector(".msv[data-msv=cpu_usage]")
    var ram_usage = document.querySelector(".msv[data-msv=ram_usage]")

    var updater = _ => {
        msv_get('stats', {a:'2'}, function(data) {
            console.log(data)
            mem.innerHTML = (parseInt(data.memory / 1024 / 1024 / 1024 * 100) / 100).toString() + ' GB'
            fh_count.innerHTML = data.file_descriptors
            cpu_usage.innerHTML = parseInt(data.cpu_usage * 100).toString() + '%'
            ram_usage.innerHTML = parseInt(data.ram_usage * 100).toString() + '%'
        })
    }

    setInterval(updater, 1000)
    updater()

}

var handler_processes = function(){
    var updater = _ => {
        msv_get('processes', {}, function(data) {
            // console.log(data)
            var table_tbody = document.querySelector(".processes-table tbody")
            var content = ""

            for (var proc of data){
                var pid = proc.pid
                var name = proc.name
                var cmd = proc.cmd
                var ppid = proc.ppid
                var uid = proc.uid
                var memory = proc.memory
                var cpu = proc.cpu

                content = content + '<tr>' +
                '<td>' + pid + '</td>' +
                '<td>' + ppid + '</td>' +
                '<td>' + name + '</td>' +
                '<td>' + cpu + '</td>' +
                '<td>' + memory + '</td>'+
                '<td>' + cmd + '</td>'+
                '<td>' + uid + '</td></tr>'

                // console.log(content)
                table_tbody.innerHTML = content

            }

        })
    }

    setInterval(updater, 1000)
    updater()
}



// handler_home()
handler_processes()
