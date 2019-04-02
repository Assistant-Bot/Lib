var express = require('express');
var Router = express.Router();
const compiler = require('../utils/compile.js');
const Util = require('../utils/main.js');
const path = require('path');
const TempGuild = Util.TempGuild;
exports.settings = {
    url: "/error"
};
exports.route = Router.get('/', async (req, res) => {
    if(req.query.reason) {
        const compiled = compiler(path.resolve(__dirname + '/../Pages/error.html'), {reason: req.query.reason});
        return res.send(compiled);
    } else {
        return res.send("<h1>An Unresolved error has occured. <a href=\"/\">Go to the main page</a></h1>");
    }
});