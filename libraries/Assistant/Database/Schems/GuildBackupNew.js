const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
var guildSchema = new mongoose.Schema({
    /* General settings */
    backupID: { type: String, required: true, index: true }, // The id of which identifies the backup.
    guildID: { type: String, required: true }, // Guild ID in which the guild belongs to
    roles: { type: Array, required: true },
    members: { type: Array, required: true },
    textChannels: { type: Array, required: true },
    parentChannels: { type: Array, required: true },
    bans: { type: Array, required: true },
    iconURL: { type: mongoose.Schema.Types.Mixed, required: true },
    splash: { type: mongoose.Schema.Types.Mixed, required: true },
    banner: { type: mongoose.Schema.Types.Mixed, required: true },
    explicitContentFilter: { type: mongoose.Schema.Types.Mixed, required: true },
    description: { type: mongoose.Schema.Types.Mixed, required: true },
    vanityURL: { type: mongoose.Schema.Types.Mixed, required: true },
    defaultNotifications: { type: mongoose.Schema.Types.Mixed, required: true },
    mfaLevel: { type: mongoose.Schema.Types.Mixed, required: true },
    name: { type: String, required: true },
    verificationlevel: { type: mongoose.Schema.Types.Mixed, required: true },
    systemChannelID: { type: mongoose.Schema.Types.Mixed, required: true },
    region: { type: String, required: true },
    afkTimeout: { type: mongoose.Schema.Types.Mixed, required: true },
    afkChannelID: { type: mongoose.Schema.Types.Mixed, required: true },
    preferredLocale: {type: mongoose.Schema.Types.Mixed, required: true},
    time: { type: Date }
}, {
    autoIndex: true,
    minimize: false,
});


module.exports = new mongoose.model('GuildBackup', guildSchema); //possibly