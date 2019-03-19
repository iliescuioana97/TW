document.addEventListener("DOMContentLoaded", function(event) {
    ready()
});

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

        elOut.append('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n')

        elOut.append('\n')

        elOut.scrollTop = elOut.scrollHeight;

        return false;
    }


}

var ready = function() {
    document.querySelectorAll(".close-menu-btn").forEach(x => x.onclick = e => toggleMenu(e, "close"));
    document.querySelectorAll(".open-menu-btn").forEach(x => x.onclick = e => toggleMenu(e, "open"));

    if(document.querySelectorAll("#console_terminal").length){
        handleConsoleFunction();
    }
}
