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

var handleConfigContainerFunctions = function() {
    var dummyContent = {
        'all': `UNIT FILE
proc-sys-fs-binfmt_misc.automount
-.mount
boot-efi.mount
boot.mount
dev-hugepages.mount
dev-mqueue.mount
proc-sys-fs-binfmt_misc.mount
snap-clion-58.mount
snap-clion-61.mount
snap-core-6350.mount
snap-core-6405.mount
snap-core-6531.mount
snap-slack-10.mount
snap-slack-11.mount
snap-slack-12.mount
snap-spotify-31.mount
snap-spotify-32.mount
snap-spotify-34.mount
snap-vscode-77.mount
snap-vscode-87.mount
snap-vscode-89.mount
sys-fs-fuse-connections.mount
sys-kernel-config.mount
sys-kernel-debug.mount
acpid.path
apport-autoreport.path
cups.path
systemd-ask-password-console.path
systemd-ask-password-plymouth.path
systemd-ask-password-wall.path
session-3.scope
accounts-daemon.service
acpid.service
alsa-restore.service
alsa-state.service
alsa-utils.service
anacron.service
apparmor.service
apport-autoreport.service
apport-forward@.service
apport.service
apt-daily-upgrade.service
apt-daily.service
autovt@.service
avahi-daemon.service
binfmt-support.service
blk-availability.service
bluetooth.service
bolt.service
bootlogd.service
bootlogs.service
bootmisc.service
checkfs.service
checkroot-bootclean.service
checkroot.service
clamav-freshclam.service
clean-mount-point@.service
colord.service
configure-printer@.service
console-getty.service
console-setup.service
container-getty@.service
cron.service
cryptdisks-early.service
cryptdisks.service
cryptmount.service
cups-browsed.service
cups.service
dbus-fi.w1.wpa_supplicant1.service
dbus-org.bluez.service
dbus-org.freedesktop.Avahi.service
dbus-org.freedesktop.hostname1.service
dbus-org.freedesktop.locale1.service
dbus-org.freedesktop.login1.service
dbus-org.freedesktop.ModemManager1.service
dbus-org.freedesktop.nm-dispatcher.service
dbus-org.freedesktop.resolve1.service
dbus-org.freedesktop.thermald.service
dbus-org.freedesktop.timedate1.service
dbus-org.freedesktop.timesync1.service
dbus.service
debug-shell.service
display-manager.service
dm-event.service
ebtables.service
emergency.service
finalrd.service
flatpak-system-helper.service
friendly-recovery.service
fstrim.service
fwupd-offline-update.service
fwupd.service
gdomap.service
geoclue.service
getty-.service
getty@.service
gpu-manager.service
grub-common.service
grub-initrd-fallback.service
halt.service
haveged.service
hostname.service
hwclock.service
iio-sensor-proxy.service
initrd-cleanup.service
initrd-parse-etc.service
initrd-switch-root.service
initrd-udevadm-cleanup-db.service
irqbalance.service
kerneloops.service
keyboard-setup.service
killprocs.service
kmod--nodes.service
kmod.service
libvirt-guests.service
libvirtd.service
logrotate.service
lvm2-lvmetad.service
lvm2-lvmpolld.service
lvm2-monitor.service
lvm2-pvscan@.service
lvm2.service
mdadm-grow-continue@.service
mdadm-last-resort@.service
mdadm-waitidle.service
mdadm.service
mdmon@.service
mdmonitor.service
ModemManager.service
module-init-tools.service
motd-news.service
motd.service
mountall-bootclean.service
mountall.service
mountdevsubfs.service
mountkernfs.service
mountnfs-bootclean.service
mountnfs.service
mpd.service
netplan-wpa@.service
network-manager.service
networkd-dispatcher.service
NetworkManager-dispatcher.service
NetworkManager-wait-online.service
NetworkManager.service
ondemand.service
packagekit-offline-update.service
packagekit.service
plymouth-halt.service
plymouth-kexec.service
plymouth-log.service
plymouth-poweroff.service
plymouth-quit-wait.service
plymouth-quit.service
plymouth-read-write.service
plymouth-reboot.service
plymouth-start.service
plymouth-switch-root.service
plymouth.service
polkit.service
postfix.service
postfix@.service
pppd-dns.service
procps.service
qemu-kvm.service
quotaon.service
rc-local.service
rc.local.service
rc.service
rcS.service
reboot.service
rescue.service
rmnologin.service
rsync.service
rsyslog.service
rtkit-daemon.service
saned.service
saned@.service
sddm.service
sendsigs.service
serial-getty@.service
setvtrgb.service
single.service
smartd.service
smartmontools.service
snapd.autoimport.service
snapd.core-fixup.service
snapd.failure.service
snapd.seeded.service
snapd.service
snapd.snap-repair.service
snapd.system-shutdown.service
spice-vdagent.service
spice-vdagentd.service
stop-bootlogd-single.service
stop-bootlogd.service
sudo.service
syslog.service
system-update-cleanup.service
systemd-ask-password-console.service
systemd-ask-password-plymouth.service
systemd-ask-password-wall.service
systemd-backlight@.service
systemd-binfmt.service
systemd-cryptsetup@sda3_crypt.service
systemd-exit.service
systemd-fsck-root.service                   -runtime
systemd-fsck@.service
systemd-fsckd.service
systemd-halt.service
systemd-hibernate-resume@.service
systemd-hibernate.service
systemd-hostnamed.service
systemd-hwdb-update.service
systemd-hybrid-sleep.service
systemd-initctl.service
systemd-journal-flush.service
systemd-journald.service
systemd-kexec.service
systemd-localed.service
systemd-logind.service
systemd-machine-id-commit.service
systemd-modules-load.service
systemd-networkd-wait-online.service
systemd-networkd.service
systemd-poweroff.service
systemd-quotacheck.service
systemd-random-seed.service
systemd-reboot.service
systemd-remount-fs.service
systemd-resolved.service
systemd-rfkill.service
systemd-suspend-then-hibernate.service
systemd-suspend.service
systemd-sysctl.service
systemd-sysusers.service
systemd-time-wait-sync.service
systemd-timedated.service
systemd-timesyncd.service
systemd-tmpfiles-clean.service
systemd-tmpfiles-setup-dev.service
systemd-tmpfiles-setup.service
systemd-udev-settle.service
systemd-udev-trigger.service
systemd-udevd.service
systemd-update-utmp-runlevel.service
systemd-update-utmp.service
systemd-user-sessions.service
systemd-volatile-root.service
thermald.service
tlp-sleep.service
tlp.service
udev.service
udisks2.service
ufw.service
umountfs.service
umountnfs.service
umountroot.service
unattended-upgrades.service
upower.service
urandom.service
usb_modeswitch@.service
usbmuxd.service
user-runtime-dir@.service
user@.service
uuidd.service
virtlockd.service
virtlogd.service
vmware-USBArbitrator.service
vmware-workstation-server.service
vmware.service
wacom-inputattach@.service
whoopsie.service
wpa_supplicant-wired@.service
wpa_supplicant.service
wpa_supplicant@.service
x11-common.service
machine.slice
user.slice
acpid.socket
apport-forward.socket
avahi-daemon.socket
cups.socket
dbus.socket
dm-event.socket
lvm2-lvmetad.socket
lvm2-lvmpolld.socket
mpd.socket
saned.socket
snapd.socket
syslog.socket
systemd-fsckd.socket
systemd-initctl.socket
systemd-journald-audit.socket
systemd-journald-dev-log.socket
systemd-journald.socket
systemd-networkd.socket
systemd-rfkill.socket
systemd-udevd-control.socket
systemd-udevd-kernel.socket
uuidd.socket
virtlockd-admin.socket
virtlockd.socket
virtlogd-admin.socket
virtlogd.socket
dev-mapper-kubuntu\x2d\x2dvg\x2dswap_1.swap
basic.target
bluetooth.target
cryptsetup-pre.target
cryptsetup.target
ctrl-alt-del.target
default.target
emergency.target
exit.target
final.target
friendly-recovery.target
getty-pre.target
getty.target
graphical.target
halt.target
hibernate.target
hybrid-sleep.target
initrd-fs.target
initrd-root-device.target
initrd-root-fs.target
initrd-switch-root.target
initrd.target
kexec.target
local-fs-pre.target
local-fs.target
multi-user.target
network-online.target
network-pre.target
network.target
nss-lookup.target
nss-user-lookup.target
paths.target
poweroff.target
printer.target
reboot.target
remote-cryptsetup.target
remote-fs-pre.target
remote-fs.target
rescue.target
rpcbind.target
runlevel0.target
runlevel1.target
runlevel2.target
runlevel3.target
runlevel4.target
runlevel5.target
runlevel6.target
shutdown.target
sigpwr.target
sleep.target
slices.target
smartcard.target
sockets.target
sound.target
spice-vdagentd.target
suspend-then-hibernate.target
suspend.target
swap.target
sysinit.target
system-update-pre.target
system-update.target
time-sync.target
timers.target
umount.target
virt-guest-shutdown.target
anacron.timer
apt-daily-upgrade.timer
apt-daily.timer
fstrim.timer
logrotate.timer
mdadm-last-resort@.timer
motd-news.timer
snapd.snap-repair.timer
systemd-tmpfiles-clean.timer

379 unit files listed.
`,

'enabled': `snap-clion-58.mount
snap-clion-61.mount
snap-core-6350.mount
snap-core-6405.mount
snap-core-6531.mount
snap-slack-10.mount
snap-slack-11.mount
snap-slack-12.mount
snap-spotify-31.mount
snap-spotify-32.mount
snap-spotify-34.mount
snap-vscode-77.mount
snap-vscode-87.mount
snap-vscode-89.mount
acpid.path
apport-autoreport.path
cups.path
accounts-daemon.service
anacron.service
apparmor.service
autovt@.service
avahi-daemon.service
binfmt-support.service
blk-availability.service
bluetooth.service
console-setup.service
cron.service
cryptmount.service
cups-browsed.service
cups.service
dbus-fi.w1.wpa_supplicant1.service
dbus-org.bluez.service
dbus-org.freedesktop.Avahi.service
dbus-org.freedesktop.ModemManager1.service
dbus-org.freedesktop.nm-dispatcher.service
dbus-org.freedesktop.resolve1.service
dbus-org.freedesktop.thermald.service
dbus-org.freedesktop.timesync1.service
ebtables.service
finalrd.service
getty@.service
gpu-manager.service
grub-initrd-fallback.service
haveged.service
irqbalance.service
kerneloops.service
keyboard-setup.service
libvirt-guests.service
libvirtd.service
lvm2-monitor.service
ModemManager.service
mpd.service
network-manager.service
networkd-dispatcher.service
NetworkManager-dispatcher.service
NetworkManager-wait-online.service
NetworkManager.service
ondemand.service
postfix.service
pppd-dns.service
qemu-kvm.service
rsync.service
rsyslog.service
setvtrgb.service
smartd.service
smartmontools.service
snapd.autoimport.service
snapd.core-fixup.service
snapd.seeded.service
snapd.service
snapd.system-shutdown.service
spice-vdagent.service
spice-vdagentd.service
syslog.service
systemd-fsck-root.service                   -runtime
systemd-resolved.service
systemd-timesyncd.service
thermald.service
tlp-sleep.service
tlp.service
udisks2.service
ufw.service
unattended-upgrades.service
whoopsie.service
wpa_supplicant.service
acpid.socket
apport-forward.socket
avahi-daemon.socket
cups.socket
dm-event.socket
lvm2-lvmetad.socket
lvm2-lvmpolld.socket
mpd.socket
snapd.socket
uuidd.socket
virtlockd-admin.socket
virtlockd.socket
virtlogd-admin.socket
virtlogd.socket
remote-fs.target
anacron.timer
apt-daily-upgrade.timer
apt-daily.timer
fstrim.timer
logrotate.timer
motd-news.timer
snapd.snap-repair.timer
`,

'disabled':
`acpid.service
clamav-freshclam.service
console-getty.service
debug-shell.service
rtkit-daemon.service
serial-getty@.service
systemd-networkd-wait-online.service
systemd-networkd.service
systemd-time-wait-sync.service
upower.service
wpa_supplicant-wired@.service
wpa_supplicant@.service
saned.socket
systemd-networkd.socket
ctrl-alt-del.target
exit.target
halt.target
kexec.target
poweroff.target
reboot.target
remote-cryptsetup.target
runlevel0.target
runlevel6.target

`,
'static':`proc-sys-fs-binfmt_misc.automount
dev-hugepages.mount
dev-mqueue.mount
proc-sys-fs-binfmt_misc.mount
sys-fs-fuse-connections.mount
sys-kernel-config.mount
sys-kernel-debug.mount
systemd-ask-password-console.path
systemd-ask-password-plymouth.path
systemd-ask-password-wall.path
alsa-restore.service
alsa-state.service
apport-autoreport.service
apport-forward@.service
apt-daily-upgrade.service
apt-daily.service
bolt.service
clean-mount-point@.service
colord.service
configure-printer@.service
container-getty@.service
dbus-org.freedesktop.hostname1.service
dbus-org.freedesktop.locale1.service
dbus-org.freedesktop.login1.service
dbus-org.freedesktop.timedate1.service
dbus.service
dm-event.service
emergency.service
flatpak-system-helper.service
friendly-recovery.service
fstrim.service
fwupd-offline-update.service
fwupd.service
geoclue.service
getty-.service
iio-sensor-proxy.service
initrd-cleanup.service
initrd-parse-etc.service
initrd-switch-root.service
initrd-udevadm-cleanup-db.service
kmod--nodes.service
kmod.service
logrotate.service
lvm2-lvmetad.service
lvm2-lvmpolld.service
lvm2-pvscan@.service
mdadm-grow-continue@.service
mdadm-last-resort@.service
mdmon@.service
mdmonitor.service
module-init-tools.service
motd-news.service
netplan-wpa@.service
packagekit-offline-update.service
packagekit.service
plymouth-halt.service
plymouth-kexec.service
plymouth-log.service
plymouth-poweroff.service
plymouth-quit-wait.service
plymouth-quit.service
plymouth-read-write.service
plymouth-reboot.service
plymouth-start.service
plymouth-switch-root.service
plymouth.service
polkit.service
procps.service
quotaon.service
rc-local.service
rc.local.service
rescue.service
snapd.failure.service
snapd.snap-repair.service
system-update-cleanup.service
systemd-ask-password-console.service
systemd-ask-password-plymouth.service
systemd-ask-password-wall.service
systemd-backlight@.service
systemd-binfmt.service
systemd-exit.service
systemd-fsck@.service
systemd-fsckd.service
systemd-halt.service
systemd-hibernate-resume@.service
systemd-hibernate.service
systemd-hostnamed.service
systemd-hwdb-update.service
systemd-hybrid-sleep.service
systemd-initctl.service
systemd-journal-flush.service
systemd-journald.service
systemd-kexec.service
systemd-localed.service
systemd-logind.service
systemd-machine-id-commit.service
systemd-modules-load.service
systemd-poweroff.service
systemd-quotacheck.service
systemd-random-seed.service
systemd-reboot.service
systemd-remount-fs.service
systemd-suspend-then-hibernate.service
systemd-suspend.service
systemd-sysctl.service
systemd-sysusers.service
systemd-timedated.service
systemd-tmpfiles-clean.service
systemd-tmpfiles-setup-dev.service
systemd-tmpfiles-setup.service
systemd-udev-settle.service
systemd-udev-trigger.service
systemd-udevd.service
systemd-update-utmp-runlevel.service
systemd-update-utmp.service
systemd-user-sessions.service
systemd-volatile-root.service
udev.service
urandom.service
usb_modeswitch@.service
usbmuxd.service
user-runtime-dir@.service
user@.service
wacom-inputattach@.service
machine.slice
user.slice
dbus.socket
syslog.socket
systemd-fsckd.socket
systemd-initctl.socket
systemd-journald-audit.socket
systemd-journald-dev-log.socket
systemd-journald.socket
systemd-udevd-control.socket
systemd-udevd-kernel.socket
basic.target
bluetooth.target
cryptsetup-pre.target
cryptsetup.target
default.target
emergency.target
final.target
friendly-recovery.target
getty-pre.target
getty.target
graphical.target
hibernate.target
hybrid-sleep.target
initrd-fs.target
initrd-root-device.target
initrd-root-fs.target
initrd-switch-root.target
initrd.target
local-fs-pre.target
local-fs.target
multi-user.target
network-online.target
network-pre.target
network.target
nss-lookup.target
nss-user-lookup.target
paths.target
printer.target
remote-fs-pre.target
rescue.target
rpcbind.target
runlevel1.target
runlevel2.target
runlevel3.target
runlevel4.target
runlevel5.target
shutdown.target
sigpwr.target
sleep.target
slices.target
smartcard.target
sockets.target
sound.target
spice-vdagentd.target
suspend-then-hibernate.target
suspend.target
swap.target
sysinit.target
system-update-pre.target
system-update.target
time-sync.target
timers.target
umount.target
virt-guest-shutdown.target
mdadm-last-resort@.timer
systemd-tmpfiles-clean.timer
`

    }
    var output = document.querySelectorAll("#view-config-container textarea")[0]

    document.querySelectorAll("#view-config-container a.log-btn").forEach(x => x.onclick = e => {
        e.preventDefault();

        var log_file = e.target.getAttribute("data-log")

        document.querySelectorAll("#view-config-container a.log-btn").forEach(x => x.classList.remove("active"))
        e.target.classList.add("active")
        output.innerHTML = dummyContent[log_file]

    })
}


var fileManagerLoadDir = function(path = '/') {
    var dirs = {
        '/': [
            {t:'d',n:'.'},
            {t:'d',n:'..'},
            {t:'d',n:'etc'},
            {t:'d',n:'var'},
            {t:'d',n:'home'},
            {t:'d',n:'dev'},
            {t:'d',n:'root'},
            {t:'f',n:'tmp'},
        ],
        '/etc': [
            {t:'d',n:'.'},
            {t:'d',n:'..'},
            {t:'d',n:'dir1'},
            {t:'f',n:'file1'},
        ],
        '/var': [
            {t:'d',n:'.'},
            {t:'d',n:'..'},
            {t:'d',n:'dir1'},
            {t:'f',n:'file1'},
        ],
        '/home': [
            {t:'d',n:'.'},
            {t:'d',n:'..'},
            {t:'d',n:'david.vultur'},
            {t:'d',n:'ioana.iliescu'},
            {t:'d',n:'matei.dascalu'},
            {t:'d',n:'david.vultur'},
        ],
    }
    if(typeof current_dir == "undefined") {
        current_dir = path;
    }

    var html_content = '';

    if(!dirs[current_dir]){
        document.querySelectorAll("#main-file-manager .items")[0].innerHTML = '<a href="#" data-dir=".." class="item"><i class="material-icons">folder</i> ..</a><br>???';
        return;
    }

    var files = dirs[current_dir];
    for(var file of files){
        var icon = file.t == 'd' ? 'folder' : 'insert_drive_file'

        html_content += `<a href="#" data-dir="${file.n}" class="item"><i class="material-icons">${icon}</i> ${file.n}</a>`
    }

    document.querySelectorAll("#main-file-manager .path")[0].innerHTML = current_dir;
    document.querySelectorAll("#main-file-manager .items")[0].innerHTML = html_content;
}

var handleFileManagerFunctions = function() {
    document.querySelectorAll("#main-file-manager .items").forEach(x => x.onclick = e => {
        e.preventDefault();
        var new_dir = e.target.getAttribute("data-dir")
        if(new_dir == '.'){
            // current_dir = current_dir
        }
        else if(new_dir == '..') {
            current_dir = '/'
        }
        else {
            current_dir = current_dir + new_dir
        }
        fileManagerLoadDir()
    })
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
