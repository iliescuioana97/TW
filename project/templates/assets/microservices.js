var host = 'localhost'

var msv_mapping = {
    'stats': 8001,
    'fs': 8003,
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
            mem.innerHTML = (parseInt(data.memory / 1024 / 1024 / 1024 * 100) / 100).toString() + ' GB'
            fh_count.innerHTML = data.file_descriptors
            cpu_usage.innerHTML = parseInt(data.cpu_usage * 100).toString() + '%'
            ram_usage.innerHTML = parseInt(data.ram_usage * 100).toString() + '%'
        })
    }

    setInterval(updater, 1000)
    updater()

}




var handler_fs = function(){
    handleFileManagerFunctions()
    fileManagerLoadDir()
}

var fileManagerLoadDir = function(path = '/') {
    if(typeof current_dir == "undefined") {
        current_dir = path;
    }

    var html_content = '';

    html_content += `<a href="#" data-dir=".." class="item clickable"><i class="material-icons">folder</i> ..</a>`

    msv_get('fs', {path: current_dir}, function(data) {
        var files = data.files;
        for(var item of files){
            var file = item.name
            var is_directory = item.dir
            var icon = is_directory ? 'folder' : 'insert_drive_file'

            html_content += `<a href="#" data-dir="${file}" class="item ${is_directory ? 'clickable' : ''}"><i class="material-icons">${icon}</i> ${file}</a>`
        }

        document.querySelectorAll("#main-file-manager .path")[0].innerHTML = current_dir;
        document.querySelectorAll("#main-file-manager .items")[0].innerHTML = html_content;

        current_dir = data.path

    })
}

var handleFileManagerFunctions = function() {
    document.querySelectorAll("#main-file-manager .items").forEach(x => x.onclick = e => {
        e.preventDefault();
        var new_dir = e.target.getAttribute("data-dir")
        if(e.target.classList.value.indexOf('clickable') == -1){
            return;
        }

        if(new_dir == '.'){
            // current_dir = current_dir
        }
        else if(new_dir == '..') {
            current_dir = current_dir.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');
            if(current_dir.length == 0) current_dir = '/'
        }
        else {
            if (current_dir.slice(-1) == '/')
                current_dir = current_dir + new_dir
            else
                current_dir = current_dir + '/' + new_dir
        }
        fileManagerLoadDir()
    })
}


handler_home()
handler_fs()
