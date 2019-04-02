var express = require('express');
var Router = express.Router();
const compiler = require('../utils/compile.js');
const Util = require('../utils/main.js');
const path = require('path');
exports.settings = {
    url: "/logout"
};
exports.route = Router.get('/', async (req, res) => {
    const cookies = Object.keys(req.cookies);
    await cookies.forEach(cookie => {
        res.clearCookie(cookie);
    });
    res.redirect('/?tool=Logout');
});
