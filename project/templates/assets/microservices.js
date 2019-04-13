var host = 'localhost'

var msv_mapping = {
    'stats': 8001,
}

var msv_get = function(service_name, data, next) {
    var http = new XMLHttpRequest();
    var url = 'http://' + host + ':' + msv_mapping[service_name] + '/';

    var params = 'a=b';
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

    setInterval(_ => {
        msv_get('stats', 'dunno', function(data) {
            console.log(data)
            mem.innerHTML = parseInt(data.memory / 1024 / 1024).toString() + ' MB'
            fh_count.innerHTML = data.file_descriptors
            cpu_usage.innerHTML = parseInt(data.cpu_usage * 100).toString() + '%'
            ram_usage.innerHTML = parseInt(data.ram_usage * 100).toString() + '%'
        })
    }, 1000)

}

handler_home()
