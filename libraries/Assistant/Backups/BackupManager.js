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
        return await bk.saveBackup();
    }

    async getBackup(database, guild) {
        const found = await database.getBackup(guild.id);
        if (!found) return null;
        else {
            console.log(found.data);
            let data = JSON.parse(found.data);
            data.backupID = found.backupID;
            data.guildID = found.guildID;
            const backup = new GuildBackup(database, data);
            return backup;
        }
    }

    async getBackupById(database, id) {
        const found = await database.getBackupById(id);
        if (!found) return null;
        else {
            let data = JSON.parse(found.data);
            data.backupID = found.backupID;
            data.guildID = found.guildID;
            //data.guildID = found.guildID;
            const backup = new GuildBackup(database, data);
            return backup;
        }
    }

    async deleteBackup(database, id) {
        const found = await database.getBackupById(id);
        if (!found) return false;
        else {
            database.deleteBackup(id);
            return true;
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
            await guild.channels.map(r => r).forEach(r => r.delete('Restore'))
            // restore parent channels first
            for (let i = 0; i < backup.parentChannels.length; i++) {
                let ch = backup.parentChannels[i];
                let newCh = await guild.createChannel(ch.name, ch)
            }
            for (let i = 0; i < backup.textChannels.length; i++) {
                let ch = backup.textChannels[i];
                let newCh = await guild.createChannel(ch.name, ch)
            }
        }
    }
}

module.exports = BackupManager;