const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const ports = {
    standard: 80,
    secure: 443
};
const dir = __dirname + "/Routes";
const fs = require('fs');
const request = require('request');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const compiler = require('./utils/compile.js');
const pages = [];

app.set('trust proxy', true);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser())
app.use(express.static(__dirname +'/Pages'));


fs.readdir(dir, async (err, files) => {
    if(err) console.log(err);
    await files.forEach(file => {
        let f = require(dir + "/" + file);
        if(file === "f.js") return;
        app.use(f.settings.url, f.route);
        pages.push(f.settings.url);
        console.log(`Route: ${file} enabled`);
    })
});
app.get('/', async (req, res) => {
    if(req.cookies["assistant.rid"]) return res.redirect('/dash');
    if(req.query.tool) {
        const compiled = compiler(path.resolve(__dirname + '/Pages/main2.html'), {tool: req.query.tool});
        return res.send(compiled);
    }
    else return res.sendFile(path.resolve(__dirname + '/Pages/main.html'));
});

http.listen(ports.standard, async () => {
    console.log(`Site signed in on port ${ports.standard}`)
});
http.listen(ports.secure, async () => {
    console.log(`Site signed in on port ${ports.secure}`)
});

module.exports = {};