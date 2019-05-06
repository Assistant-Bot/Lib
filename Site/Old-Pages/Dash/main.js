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
function logout() {
    notify("Redirect");
    document.location.href="/logout";
}
function loadServers(transport) {
    const guilds = transport.guilds;
    guild = guilds.sort((a, b) => {if(a.name < b.name) return -1; if(a.name > b.name) return 1; else return 0;});
    guilds.forEach(guild => {
        const server = newServer(guild);
        document.getElementById('servers').appendChild(server);
    });
}
function newServer(guild) {
    const server = document.createElement("div");
    let BTN = `<a class="waves-effect btn" href="/guild/${guild.id}">Manage</a>`;
    let serverHtml = `<div class="server"><div class="server-icon"><img src="${guild.icon}" style="width:30%"></div><div class="server-txt"><span class="server-text">${guild.name}</span></div><div class="server-btns">${BTN}</div></div>`;
    if(!guild.allowed) serverHtml = "";
    server.innerHTML = serverHtml;
    return server;
}