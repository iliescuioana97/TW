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

    if(document.querySelectorAll("#add-machine").length){
        handleAddMachine();
    }
    registerModal();
}
