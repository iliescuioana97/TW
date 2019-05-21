document.addEventListener("DOMContentLoaded", function(event) {
    ready()
});


var showModal = function(data) {

}

var ajaxPost = function(url, data, next) {
    var http = new XMLHttpRequest();

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

var ajaxGet = function(url, next) {
    var http = new XMLHttpRequest();

    http.open('GET', url, true);
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
    http.send();
}

var toggleMenu = function(e, action = "open") {
    if(e) e.preventDefault();

    if(action == "open"){
        document.querySelectorAll(".responsive-handling").forEach(x => x.classList.add("show"))
    }
    else if(action == "close"){
        document.querySelectorAll(".responsive-handling").forEach(x => x.classList.remove("show"))
    }
}

var registerModal = function() {
    document.querySelector("body").insertAdjacentHTML("afterBegin", '<div class="modal"><div class="modal-overlay"></div><div class="modal-container animate-bounce"></div></div>')
    document.querySelector(".modal-overlay").onclick = function(){
        document.querySelector(".modal").classList.remove("show")
    }
}

var openModal = function(html) {
    document.querySelector(".modal .modal-container").innerHTML = html;
    document.querySelector(".modal").classList.add("show")
}

var handleAddMachine = function() {
    document.querySelector("#add-machine").onclick = function() {
        openModal(`
            <form action="" id="form-add-machine" class="text-center">
                <h3 class="title">Add new machine</h3>
                <input class="input-main" id="add_machine_name" placeholder="Machine Name" autocomplete="off"> <br>
                <input class="input-main" id="add_machine_host" placeholder="Machine Address" autocomplete="off"> <br>
                <input type="submit" class="btn btn-outline btn-lg" value="Add Machine">
            </form>
        `)

        document.querySelector("#form-add-machine").onsubmit = function(e) {
            var mach_name = document.querySelector("#form-add-machine #add_machine_name").value
            var mach_host = document.querySelector("#form-add-machine #add_machine_host").value

            ajaxPost('/machines/add', {name: mach_name, host: mach_host}, function(data) {
                if(data && data.success) {
                    return window.location.reload()
                }
                if(data && data.error) {
                    return alert(data.error)
                }
                alert("Unknown error.")
            })

            return false;
        }

        // <input class="input-main" placeholder="Username"> <br>
        // <input class="input-main" placeholder="Password"> <br>
        // <input class="input-main" placeholder="Key"> <br>
    }
}

var handleMachinesView = function() {
    var tpl = `<div class="col-sm-12 col-md-4 col-lg-3">
        <a href="/machine/{{id}}/" class="card machine-card" data-id="{{id}}">
            <div class="machine-card-buttons">
                <i class="material-icons remove-btn"> delete_forever </i>
            </div>
            <div class="machine-name">
                <i class="material-icons">computer</i>
                {{name}}
            </div>
        </a>
    </div>`

    ajaxGet('/machines/get', function(data) {
        if(data.error) {
            return alert(data.error)
        }
        var machines = data.machines
        glob_machines = machines

        var html = ''
        for(var machine of machines) {
            html += tpl.replace('{{id}}', machine.id).replace('{{name}}', machine.machine_name).replace('{{id}}', machine.id)
        }

        document.querySelector('#machine-list-row').innerHTML = html;


        document.querySelectorAll(".remove-btn").forEach(x => x.onclick = e => {
            e.preventDefault();
            var machine_id = x.parentElement.parentElement.getAttribute("data-id")

            if(confirm("Are you sure?")) {
                ajaxPost('/machines/del', {machine_id: machine_id}, function(data) {
                    if(data && data.success) {
                        return window.location.reload()
                    }
                    if(data && data.error) {
                        return alert(data.error)
                    }
                    alert("Unknown error.")
                })
            }
        })

        document.querySelectorAll(".machine-card").forEach(x => x.onclick = e => {
            e.preventDefault();
            var machine_id = x.getAttribute("data-id")

            var machine_data = glob_machines.find(x => x.id == machine_id)

            openModal(`
                <form action="" id="form-conn-machine" class="text-center">
                    <h3 class="title">Connect to Machine</h3>
                    <input class="input-main" id="conn_mach_user" placeholder="Username" autocomplete="off"> <br>
                    <input class="input-main" id="conn_mach_pass" placeholder="Password" type="password"> <br>
                    <p class="connect_msg" style="display: none;">Connecting...</p>
                    <p class="alert txt error connect_error_msg"></p>
                    <input type="submit" class="btn btn-outline btn-lg" value="Connect">
                </form>
            `)

            document.querySelector("#form-conn-machine").onsubmit = function(e) {
                var conn_user = document.querySelector("#form-conn-machine #conn_mach_user").value
                var conn_pass = document.querySelector("#form-conn-machine #conn_mach_pass").value

                if(typeof started_req_conn != 'undefined' && started_req_conn){
                    return false;
                }
                started_req_conn = true;
                document.querySelector('.connect_msg').style.display = 'block'
                document.querySelector(".connect_error_msg").innerHTML = ''

                msv_get('auth', {
                    auth: true,
                    username: conn_user,
                    password: conn_pass,
                }, function(data) {
                    document.querySelector('.connect_msg').style.display = 'none'
                    started_req_conn = false;
                    if(data && data.error) {
                        document.querySelector(".connect_error_msg").innerHTML = data.error
                        return
                    }
                    if(data && data.token) {
                        machine_data.token = data.token
                        localStorage.setItem("machine_" + machine_data.id, JSON.stringify(machine_data))
                        window.location.href = '/machine/' + machine_data.id + '/';
                        return;
                    }
                    alert("Unkown error.")
                }, machine_data.machine_ip)

                return false;
            }
        })
    })

}

var ready = function() {
    document.querySelectorAll(".close-menu-btn").forEach(x => x.onclick = e => toggleMenu(e, "close"));
    document.querySelectorAll(".open-menu-btn").forEach(x => x.onclick = e => toggleMenu(e, "open"));

    if(document.querySelectorAll("#add-machine").length){
        handleAddMachine();
    }
    if(document.querySelectorAll("#machine-list-row").length){
        handleMachinesView();
    }
    registerModal();
}
