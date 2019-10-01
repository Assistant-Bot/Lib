const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
var guildSchema = new mongoose.Schema({
    /* General settings */
    backupID: { type: String, required: true, index: true }, // The id of which identifies the backup.
    guildID: { type: String, required: true }, // Guild ID in which the guild belongs to
    data: { type: String },
    time: { type: Date }
}, {
    autoIndex: true,
    minimize: false,
});


module.exports = new mongoose.model('GuildBackup', guildSchema);