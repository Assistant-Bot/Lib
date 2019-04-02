const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const catchAsync = require('../utils/catch.js');
var Router = express.Router();
const CLIENT_ID = "344506432223182848";
const CLIENT_SECRET = "JKNmuh8WlSUoFJrf1QBrWfuPlj1it6uX";
const discordURL = "http://www.assistantbot.net/api/discord/callback";
const redirect = encodeURIComponent(discordURL);

exports.settings = {
    url: "/api/discord/callback"
};
exports.route = Router.get('/', catchAsync(async (req, res) => {
    if (!req.query.code) throw new Error('NoCodeProvided');
    const code = req.query.code;
    const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${creds}`,
        },
      });
    const json = await response.json();
    res.redirect(`/return/?token=${json.access_token}&refresh=${json.refresh_token}`);
  }));