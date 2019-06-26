//const Site = require('./Site/start.js');
const Bot = require('./Bot/index');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/whatever', {
    useNewUrlParser: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});