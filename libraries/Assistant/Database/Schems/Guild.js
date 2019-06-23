const {Schema, model} = require('mongoose');

var guildSchema = new Schema({
    /* General settings */
    guildID: { type: String, required: true, index: true }, // Guild ID
    prefix: { type: String, default: 'a!' }, // Guild Prefix

    /* Configuration */
    customCommands: {type: Array, default: []}, // Custom Commands
    events: {type: Array, default: []},
    logChannel: {type: String, default: false},
    disabledCommands: {type: Array, default: []},

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


module.exports = new model('Guild', guildSchema);