const Eris = require('eris');
const Guild = Eris.Guild;
class GuildBackup {
    constructor (database, guild) {
        this.mode = (guild instanceof Guild) ? 0 : 1;
        this.database = database;
        this.guild = guild;
    }

    async initBackup() {
        if (this.mode !== 0) return null;
        this.roles = this.guild.roles.map(r => {
            return {
                id: r.id,
                color: r.color,
                name: r.name,
                position: r.position,
                hoist: r.hoist,
                mentionable: r.mentionable,
                managed: r.managed,
                permissions: r.permissions.allow
            }
        });
        this.members = this.guild.members.map(m => {
            return {
                id: m.id,
                roles: m.roles,
                nick: m.nick,
            }
        });
        this.textChannels = this.guild.channels.map(c => {
            if (c.type === 0 || c.type === 5) return {
                id: c.id,
                name: c.name,
                topic: c.topic,
                slowdown: c.rateLimitPerUser,
                customPerms: c.permissionOverwrites,
                nsfw: c.nsfw,
                type: c.type,
                parentID: c.parentID
            }
        });
        this.parentChannels = this.guild.channels.map(c => {
            if (c.type === 4) return {
                id: c.id,
                name: c.name,
                customPerms: c.permissionOverwrites,
                position: c.position,
                channels: c.channels.map(ch => ch.id),
                type: c.type
            }
        });
        this.voiceChannels = this.guild.channels.map(c => {
            if (c.type === 2) return {
                id: c.id,
                name: c.name,
                bitrate: c.bitrate,
                userLimit: c.userLimit,
                customPerms: c.permissionOverwrites,
                type: c.type,
                parentID: c.parentID
            }
        });


        this.bans = await this.guild.getBans();
        // Save icon later.
        this.icon = this.guild.icon;
        this.iconURL = this.guild.iconURL;
        this.splash = this.guild.splash;
        this.banner = this.guild.banner;
        this.explicitContentFilter = this.guild.explicitContentFilter;
        this.description = this.guild.description;
        this.vanityURL = this.guild.vanityURL;
        this.defaultNotifications = this.guild.defaultNotifications;
        this.mfaLevel = this.guild.mfaLevel;
        this.name = this.guild.name;
        this.verificationLevel = this.guild.verificationLevel;
        this.systemChannelID = this.guild.systemChannelID;
        this.region = this.guild.region;
        this.afkTimeout = this.guild.afkTimeout;
        this.afkChannelID = this.guild.afkChannelID;
        this.preferredLocale = this.guild.preferredLocale;
        await this.clean();
        return this.getBackup();
    }

    async clean() {
        let cleaned = {
            textChannels: [],
            voiceChannels: [],
            parentChannels: []
        }
        for (let i = 0; i < this.textChannels.length; i++) {
            let key = this.textChannels[i];
            if (!key) continue;
            else cleaned.textChannels.push(key);
        }
        for (let i = 0; i < this.voiceChannels.length; i++) {
            let key = this.voiceChannels[i];
            if (!key) continue;
            else cleaned.voiceChannels.push(key);
        }
        for (let i = 0; i < this.parentChannels.length; i++) {
            let key = this.parentChannels[i];
            if (!key) continue;
            else cleaned.parentChannels.push(key);
        }
        this.parentChannels = cleaned.parentChannels;
        this.textChannels = cleaned.textChannels;
        this.voiceChannels = cleaned.voiceChannels;
    }

    getBackup() {
        if (this.mode === 0) {
            return {
                roles: this.roles,
                members: this.members,
                textChannels: this.textChannels,
                parentChannels: this.parentChannels,
                voiceChannels: this.voiceChannels,
                bans: this.bans,
                icon: this.icon,
                iconURL: this.iconURL,
                splash: this.splash,
                banner: this.banner,
                explicitContentFilter: this.explicitContentFilter,
                description: this.description,
                vanityURL: this.vanityURL,
                defaultNotifications: this.defaultNotifications,
                mfaLevel: this.mfaLevel,
                name: this.name,
                verificationLevel: this.verificationLevel,
                systemChannelID: this.systemChannelID,
                region: this.region,
                afkTimeout: this.afkTimeout,
                afkChannelID: this.afkChannelID,
                preferredLocale: this.preferredLocale,
                time: new Date()
            };
        } else {
            return this.guild;
        }
    }

    getStats() {
        let bk = this.getBackup();
        let data = {
            roles: bk.roles.length,
            members: bk.members.length,
            bans: bk.bans.length,
            channels: bk.textChannels.length + bk.voiceChannels.length + bk.parentChannels.length,
            guildSettings: '**Name:** ' + bk.name + '\n **Region:** ' + bk.region + 
            '\n **Content Filter:** ' + bk.explicitContentFilter,
            iconURL: bk.iconURL,
            time: bk.time
        }
        return data;
    }

    async saveBackup(db=null) {
        let database = (!db) ? this.database : db;
        let backupCode = this.randomBkCode();
        let stats = this.getStats();
        stats.backupCode = backupCode;
        await database.saveBackup(this.guild.id, backupCode, this.getBackup());
        return stats;
    }

    randomBkCode(amt=20) {
        let poss = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-_+=.';
        let code = '';
        for (let i = 0; i < amt; i++) {
            code += poss[Math.floor(Math.random() * poss.length)];
        }
        return code;
    }
}

module.exports = GuildBackup;