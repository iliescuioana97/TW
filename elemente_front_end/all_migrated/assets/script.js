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

        elOut.append('2019-02-08 11:57:53 trigproc libglib2.0-0:amd64. Your command was ' + command + '\n' + ` 2.56.3-0ubuntu0.18.04.1 <none>
2019-02-08 11:57:53 status half-configured libglib2.0-0:amd64 2.56.3-0ubuntu0.18.04.1`)

        elOut.append('\n')

        elOut.scrollTop = elOut.scrollHeight;

        return false;
    }


}

var handleLogContainerFunctions = function() {
    var dummyContent = {
        '/var/log/dpkg.log': `2019-02-08 11:57:53 trigproc libglib2.0-0:amd64 2.56.3-0ubuntu0.18.04.1 <none>
2019-02-08 11:57:53 status half-configured libglib2.0-0:amd64 2.56.3-0ubuntu0.18.04.1
2019-02-08 11:57:53 status installed libglib2.0-0:amd64 2.56.3-0ubuntu0.18.04.1
2019-02-08 11:57:53 trigproc man-db:amd64 2.8.3-2 <none>
2019-02-08 11:57:53 status half-configured man-db:amd64 2.8.3-2
2019-02-08 11:57:54 status installed man-db:amd64 2.8.3-2
2019-02-08 11:57:54 trigproc hicolor-icon-theme:all 0.17-2 <none>
2019-02-08 11:57:54 status half-configured hicolor-icon-theme:all 0.17-2
2019-02-08 11:57:54 status installed hicolor-icon-theme:all 0.17-2
2019-02-08 11:57:54 startup packages configure`,
        '/var/log/fontconfig.log': `/usr/share/fonts: caching, new cache contents: 0 fonts, 1 dirs
/usr/share/fonts/truetype: caching, new cache contents: 0 fonts, 2 dirs
/usr/share/fonts/truetype/dejavu: caching, new cache contents: 22 fonts, 0 dirs
/usr/share/fonts/truetype/lato: caching, new cache contents: 18 fonts, 0 dirs
/usr/local/share/fonts: caching, new cache contents: 0 fonts, 0 dirs
/var/cache/fontconfig: cleaning cache directory
fc-cache: succeeded`,
        '/var/log/alternatives.log': `update-alternatives 2019-02-08 11:34:59: run with --install /usr/bin/wsgen wsgen /usr/lib/jvm/java-11-openjdk-amd64/bin/wsgen 1101 --slave /usr/share/man/man1/wsgen.1.gz wsgen.1.gz /usr/lib/jvm/java-11-openjdk-amd64/man/man1/wsgen.1.gz
update-alternatives 2019-02-08 11:34:59: link group wsgen updated to point to /usr/lib/jvm/java-11-openjdk-amd64/bin/wsgen
update-alternatives 2019-02-08 11:34:59: run with --install /usr/bin/jcmd jcmd /usr/lib/jvm/java-11-openjdk-amd64/bin/jcmd 1101 --slave /usr/share/man/man1/jcmd.1.gz jcmd.1.gz /usr/lib/jvm/java-11-openjdk-amd64/man/man1/jcmd.1.gz
update-alternatives 2019-02-08 11:34:59: link group jcmd updated to point to /usr/lib/jvm/java-11-openjdk-amd64/bin/jcmd
update-alternatives 2019-02-08 11:34:59: run with --install /usr/bin/jarsigner jarsigner /usr/lib/jvm/java-11-openjdk-amd64/bin/jarsigner 1101 --slave /usr/share/man/man1/jarsigner.1.gz jarsigner.1.gz /usr/lib/jvm/java-11-openjdk-amd64/man/man1/jarsigner.1.gz
update-alternatives 2019-02-08 11:34:59: link group jarsigner updated to point to /usr/lib/jvm/java-11-openjdk-amd64/bin/jarsigner
update-alternatives 2019-02-08 11:35:04: run with --install /usr/bin/appletviewer appletviewer /usr/lib/jvm/java-11-openjdk-amd64/bin/appletviewer 1101 --slave /usr/share/man/man1/appletviewer.1.gz appletviewer.1.gz /usr/lib/jvm/java-11-openjdk-amd64/man/man1/appletviewer.1.gz
update-alternatives 2019-02-08 11:35:04: link group appletviewer updated to point to /usr/lib/jvm/java-11-openjdk-amd64/bin/appletviewer
update-alternatives 2019-02-08 11:35:04: run with --install /usr/bin/jconsole jconsole /usr/lib/jvm/java-11-openjdk-amd64/bin/jconsole 1101 --slave /usr/share/man/man1/jconsole.1.gz jconsole.1.gz /usr/lib/jvm/java-11-openjdk-amd64/man/man1/jconsole.1.gz
update-alternatives 2019-02-08 11:35:04: link group jconsole updated to point to /usr/lib/jvm/java-11-openjdk-amd64/bin/jconsole`,
    }
    var output = document.querySelectorAll("#view-logs-container textarea")[0]

    document.querySelectorAll("#view-logs-container a.log-btn").forEach(x => x.onclick = e => {
        e.preventDefault();

        var log_file = e.target.getAttribute("data-log")

        document.querySelectorAll("#view-logs-container a.log-btn").forEach(x => x.classList.remove("active"))
        e.target.classList.add("active")
        output.innerHTML = dummyContent[log_file]

    })
}

var ready = function() {
    document.querySelectorAll(".close-menu-btn").forEach(x => x.onclick = e => toggleMenu(e, "close"));
    document.querySelectorAll(".open-menu-btn").forEach(x => x.onclick = e => toggleMenu(e, "open"));

    if(document.querySelectorAll("#console_terminal").length){
        handleConsoleFunction();
    }
    if(document.querySelectorAll("#view-logs-container").length){
        handleLogContainerFunctions();
    }
}
