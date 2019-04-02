var express = require('express');
var Router = express.Router();
exports.settings = {
    url: "/guild"
};
exports.route = Router.get('/*', async (req, res) => {
    res.status(403);
    res.redirect('/error/?reason=This%20area%20has%20not%20been%20setup%20yet.%20:(');
});