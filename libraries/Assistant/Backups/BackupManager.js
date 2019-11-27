const GuildBackup = require('./GuildBackup');
const Eris = require('eris');
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
            data.owner = found.owner;
            data.locked = found.locked;
            data.password = found.password;
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

    async restore(bot, backup, guild, nodelete=null) {
        let updateIds = {};
        backup = backup.guild;
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
        }, 'Restore from: ' + backup.backupID);
        // destroy guild entirely.
        await guild.roles.map(r => r).forEach(async r => {
            try{
                if (r.managed) return; 
                if (!r) return;
                else await r.delete();
            }catch(e) {
                return;
            }
        });
        await guild.channels.map(c => c).forEach(async c => {
            if (c.id === nodelete) return;
            try {await c.delete()}catch(e) {return};
        });
        // restore parent channels first
        for (let i = 0; i < backup.parentChannels.length; i++) {
            let ch = backup.parentChannels[i];
            let newCh = await guild.createChannel(ch.name, ch.type, `Restore from backup: ${backup.backupID}`);
            updateIds[ch.id] = newCh.id;
        }
        for (let i = 0; i < backup.textChannels.length; i++) {
            try {
                let ch = backup.textChannels[i];
                let parent = (!ch.parentID) ? false : updateIds[ch.parentID];
                let newCh;
                if (!parent) newCh = await guild.createChannel(ch.name, ch.type, `Restore from backup: ${backup.backupID}`);
                else newCh = await guild.createChannel(ch.name, ch.type, `Restore from backup: ${backup.backupID}`, parent);
                updateIds[ch.id] = newCh.id;
            } catch (e) {
                continue;
            }
        }
        for (let i = 0; i < backup.voiceChannels.length; i++) {
            try {
                let ch = backup.voiceChannels[i];
                let parent = (!ch.parentID) ? false : updateIds[ch.parentID];
                let newCh;
                if (!parent) newCh = await guild.createChannel(ch.name, ch.type, `Restore from backup: ${backup.backupID}`);
                else newCh = await guild.createChannel(ch.name, ch.type, `Restore from backup: ${backup.backupID}`, parent);
                updateIds[ch.id] = newCh.id;
            } catch (e) {
                continue;
            }
        }
        for (let i = 0; i < backup.roles.length; i++) {
            try {
                let role = backup.roles[i];
                if (role.id === guild.id) continue;
                if (role.managed) continue;
                let newRole = await guild.createRole(role);
                updateIds[role.id] = newRole.id;
            } catch (e) {
                continue;
            }
        }
        for (let i = 0; i < backup.roles.length; i++) {
            try {
                let role = backup.roles[i];
                if (role.id === guild.id) continue;
                let newRole = bot.guilds.get(guild.id).roles.get(updateIds[role.id]);
                newRole.editPosition(role.position);
            } catch (e) {
                continue;
            }
        }
        for (let i = 0; i < backup.members.length; i++) {
            let member = backup.members[i];
            if (!bot.guilds.get(guild.id).members.has(member.id)) continue;
            else {
                let roles = [];
                await member.roles.forEach(r => {
                    if (updateIds[r]) roles.push(updateIds[r]);
                });
                if (roles.length < 1) continue;
                try {
                    await bot.guilds.get(guild.id).members.get(member.id).edit({
                        roles: roles
                    });
                    await bot.guilds.get(guild.id).members.get(member.id).edit({
                        nick: member.nick
                    });
                } catch (e) {
                    continue;
                }
            }
        }
    }
}

module.exports = BackupManager;