const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
var guildSchema = new mongoose.Schema({
    /* General settings */
    guildID: { type: String, required: true, index: true }, // Guild ID
    prefix: { type: String, default: 'a!' }, // Guild Prefix
    premium: {type: Number, default: 0},

    /* Configuration */
    customCommands: {type: Array, default: []}, // Custom Commands
    events: {type: Array, default: []},
    logChannel: {type: String, default: false},
    disabledCommands: {type: Array, default: []},
    linkedServers: {type: Array, default: []},

    ignoredUsers: { type: Array, default: [] }, // ids
    ignoredRoles: { type: Array, default: [] }, // ids
    ignoredChannels: { type: Array, default: [] }, // ids


    /* Moderation */
    modOnly: { type: Boolean, default: false },
    modRoles: { type: Array, default: [], required: false },
    modUsers: { type: Array, default: [], required: false }
}, {
    autoIndex: true,
    minimize: false,
});


module.exports = new mongoose.model('Guild', guildSchema);