document.addEventListener("DOMContentLoaded", function(event) {
    ready()
});


var showModal = function(data) {

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

var handleConsoleFunction = function(){
    var elOut = document.querySelectorAll("#console_terminal pre")[0]
    var elIn = document.querySelectorAll("#console_terminal input")[0]
    var elForm = document.querySelectorAll("#console_terminal form")[0]

    elForm.onsubmit = function(){
        var command = elIn.value.trim();
        elIn.value = ""

        elOut.append(`> ${command}\n`)

        elOut.append('2019-02-08 11:57:53 trigproc libglib2.0-0:amd64. Your command was ' + command + '\n' + ` 2.56.3-0ubuntu0.18.04.1 <none>
2019-02-08 11:57:53 status half-configured libglib2.0-0:amd64 2.56.3-0ubuntu0.18.04.1`)

        elOut.append('\n')

        elOut.scrollTop = elOut.scrollHeight;

        return false;
    }


}

var handleConfigContainerFunctions = function() {
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
                <h3 class="title">Add new server</h3>
                <input class="input-main" placeholder="Server Name"> <br>
                <input class="input-main" placeholder="Server Address"> <br>
                <input class="input-main" placeholder="Username"> <br>
                <input class="input-main" placeholder="Password"> <br>
                <input class="input-main" placeholder="Key"> <br>
                <input type="submit" class="btn btn-outline btn-lg" value="Add Server">
            </form>
        `)
    }
}

var ready = function() {
    document.querySelectorAll(".close-menu-btn").forEach(x => x.onclick = e => toggleMenu(e, "close"));
    document.querySelectorAll(".open-menu-btn").forEach(x => x.onclick = e => toggleMenu(e, "open"));

    if(document.querySelectorAll("#console_terminal").length){
        handleConsoleFunction();
    }
    if(document.querySelectorAll("#add-machine").length){
        handleAddMachine();
    }
    if(document.querySelectorAll("#view-logs-container").length){
        handleLogContainerFunctions();
    }
    if(document.querySelectorAll("#view-config-container").length){
        handleConfigContainerFunctions();
    }
    if(document.querySelectorAll("#main-file-manager").length){
        handleFileManagerFunctions();
        fileManagerLoadDir();
    }
    registerModal();
}
