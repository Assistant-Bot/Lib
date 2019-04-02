var express = require('express');
var Router = express.Router();
const compiler = require('../utils/compile.js');
const Util = require('../utils/main.js');
const path = require('path');
exports.settings = {
    url: "/return"
};
exports.route = Router.get('/', async (req, res) => {
    const url = req.baseUrl.split("/");
    const token = req.query.token;
    if(token == undefined) return res.redirect('/');
    res.cookie('assistant.id',token, { maxAge: 86400*1000*4 });
    res.cookie('assistant.rid',req.query.refresh, { maxAge: 86400*1000*4 });
    res.redirect('/dash');
});