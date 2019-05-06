var express = require('express');
var Router = express.Router();
const CLIENT_ID = "344506432223182848";
const CLIENT_SECRET = "JKNmuh8WlSUoFJrf1QBrWfuPlj1it6uX";
const discordURL = "https://discordapp.com/api/oauth2/authorize?client_id=344506432223182848&redirect_uri=http%3A%2F%2Fwww.assistantbot.net%2Fapi%2Fdiscord%2Fcallback&response_type=code&scope=identify%20email%20guilds%20guilds.join";
//LOCAL"https://discordapp.com/api/oauth2/authorize?client_id=344506432223182848&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fapi%2Fdiscord%2Fcallback&response_type=code&scope=identify%20email%20guilds";
const redirect = encodeURIComponent(discordURL);

exports.settings = {
    url: "/login*"
};
exports.route = Router.get('/', async (req, res) => {
    res.redirect(discordURL);
    //res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});