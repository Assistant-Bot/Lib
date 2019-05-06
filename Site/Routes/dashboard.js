var express = require('express');
var Router = express.Router();
const compiler = require('../utils/compile.js');
const Util = require('../utils/main.js');
const path = require('path');
const TempGuild = Util.TempGuild;
exports.settings = {
    url: "/dash"
};
exports.route = Router.get('/', async (req, res) => {
    if(!req.cookies["assistant.id"]) return res.redirect('/login');
    let opts = {
        headers: {'Authorization': `Bearer ${req.cookies["assistant.id"]}`},
        method: "GET"
    }
    const data = await Util.fetch('http://discordapp.com/api/users/@me', opts);
    if(data === false) return res.redirect('/error/?reason=Fetch%20to%20Discord%20has%20failed');
    if(data.message) return res.redirect('/login');
    var guilds = await Util.fetch('http://discordapp.com/api/users/@me/guilds', opts);
    
    /* Guild icons */
    for(let i = 0; i < guilds.length; i++) {
        guilds[i] = new TempGuild(guilds[i]); 
        if(guilds[i].hasPermission("MANAGE_GUILD")) guilds[i].allowed = true;
        else guilds[i].allowed = false;
    }

    const compiled = compiler(path.resolve(__dirname + '/../Pages/dash.html'), {
        avatar: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}`,
        username: data.username + "#" + data.discriminator,
        guilds: guilds
    })
    res.send(compiled);
});