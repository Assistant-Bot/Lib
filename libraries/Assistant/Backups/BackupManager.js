const GuildBackup = require('./GuildBackup');
class BackupManager {
    constructor () {
        this.restores = 0;
        this.backups = 0;
    }

    async backup(database, guild) {
        const bk = new GuildBackup(database, guild);
        await bk.initBackup();
        this.backups++;
        return bk.saveBackup(database);
    }

    async getBackup(database, guild) {
        const found = await database.getBackup(guild.id);
        if (!found) return null;
        else {
            const backup = new GuildBackup(database, found);
            return backup;
        }
    }

    async restore(backup, guild, opts=null, m=null) {
        if (!opts) {
            let updateIds = {};
            guild.edit({
                name: backup.name,
                region: backup.region,
                icon: backup.icon,
                verificationLevel: backup.verificationLevel,
                defaultNotifications: backup.defaultNotifications,
                explicitContentFilter: backup.explicitContentFilter,
                systemChannelID: backup.systemChannelID,
                afkChannelID: backup.afkChannelID,
                afkTimeout: backup.afkTimeout,
                splash: backup.splash,
                banner: backup.banner
            }, reason);
            // destroy guild entirely.
            await guild.roles.map(r => r).forEach(r => r.delete('Restore'))
            // restore parent channels
            for (let i = 0; i < this.textChannels.length; i++) {

            }
        }
    }
}

module.exports = BackupManager;