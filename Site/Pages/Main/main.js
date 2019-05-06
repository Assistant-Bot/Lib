function notification(content) {
    var toastHTML = content;
    M.toast({html: toastHTML, classes: "black"});
}
function fail(txt) {
    notification(`<span style="color: red;">${txt} failed</span>`);
}
function notify(txt) {
    notification(`<span style="color: #00e676;">${txt} successful</span>`);
}
function reload(t) {
    notify(t);
}