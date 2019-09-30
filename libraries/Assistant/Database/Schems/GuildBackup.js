const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
var guildSchema = new mongoose.Schema({
    /* General settings */
    guildID: { type: String, required: true, index: true }, // Guild ID
}, {
    autoIndex: true,
    minimize: false,
});


module.exports = new mongoose.model('GuildBackup', guildSchema);