var express = require('express');
var Router = express.Router();
exports.settings = {
    url: "/api"
};
exports.route = Router.get('/', async (req, res) => {
    let endpoints = [];
    if(req.baseUrl.split("/api/").length < 2) endpoints = ["DEFAULT"];
    else endpoints = req.baseUrl.split("/api/")[1].split("/");
    res.status(403);
    res.send({"Error": "API not accessible.", endpoints: endpoints})
});