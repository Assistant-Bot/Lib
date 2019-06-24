class Blacklist {
    constructor() {
        this.name = 'blacklist';
        this.aliases = [];
        this.description = '/blacklist';
        this.longDescription = 'None.';
        this.list = false;
    }

    async onRun(bot, msg, args, Util, emojis) {
        let m, output;
        let wrapped = new Util.Wrapper(args);
        try {
            if (!wrapped[0]) return Util.sendError(msg, emojis, 'custom', '**Usage:** a!blacklist <add/remove/view> [id] [reason]');
            if (args[0] == 'view') {
                if (args[1]) {
                    let blacklisted = Util.blacklist(args[1], 3);
                    if (!blacklisted) return Util.sendError(msg, emojis, 'custom', 'User not found. ');
                    else {
                        let em = new Util.SimpleEmbed();
                        em.setColor('#ff0000');
                        em.setTitle(blacklisted.user.username);
                        em.addField('Username', blacklisted.user.username + '#' + blacklisted.user.discriminator, true);
                        em.addField('ID', blacklisted.user.id, true);
                        em.addField('Reason', blacklisted.reason);
                        em.addField('Moderator Username', blacklisted.admin.username + '#' + blacklisted.admin.discriminator, true);
                        em.addField('Moderator ID', blacklisted.admin.id);
                        em.setTimestamp(new Date(blacklisted.time));
                        em.setFooter('Blacklisted since');
                        return msg.channel.send(em);
                    }
                }
                let blacklisted = Util.blacklist('0', 4);
                let clean = [];
                let keys = Object.keys(blacklisted);
                let i = 0;
                await keys.forEach(async (key) => {
                    i++;
                    let ob = blacklisted[key];
                    clean.push(`**${i}.)** __${ob.user.username} (\`${key}\`)__ - **M** ${ob.admin.username} (\`${ob.admin.id}\`)`);
                });

                if (keys.length == 0) return Util.sendError(msg, emojis, 'custom', 'No blacklisted users.');

                let em = new Util.SimpleEmbed();
                em.setColor('#ff0000');
                em.setTitle('All blacklisted users');
                em.setDescription(clean.join('\n'));
                return msg.channel.send(em);
            } 
            if (msg.author.id != '217006264570347520') return Util.sendError(msg, emojis, 'custom', 'You can\'t do this.');

            if (args[0] == 'add') {
                if (!wrapped[1]) return Util.sendError(msg, emojis, 'custom', 'Invalid user.');
                let user = await bot._restClient.getRESTUser(wrapped[1]);
                if (!user) return Util.sendError(msg, emojis, 'custom', 'Invalid user.');
                let reason = (!wrapped[2]) ? "No reason provided" : wrapped[2];
                Util.blacklist(wrapped[1], 0, msg.author.id, reason, {user: user, admin: msg.author});

                return msg.channel.send(emojis.greentick + ' Successfully blacklisted `' + user.username + ' (' + user.id + ')` with reason: `' + reason + '`');
            } else if (args[0] == 'remove') {
                if (!wrapped[1]) return Util.sendError(msg, emojis, 'custom', 'Invalid user.');
                let user = await bot._restClient.getRESTUser(wrapped[1]);
                if (!user) return Util.sendError(msg, emojis, 'custom', 'Invalid user.');
                let reason = (!wrapped[2]) ? "No reason provided" : wrapped[2];
                Util.blacklist(wrapped[1], 1, msg.author.id, reason);

                return msg.channel.send(emojis.greentick + ' Successfully unblacklisted `' + user.username + ' (' + user.id + ')` with reason: `' + reason + '`');
            } else return Util.sendError(msg, emojis, 'custom', '**Usage:** a!blacklist <add/remove/view> [id] [reason]');
        } catch (e) {
            return msg.channel.send(`${emojis.redtick} Failed to run command: ${e}`);
        }
    }

    async onError(bot, msg, args, Util, emojis) {
        Util.logError(bot, msg, args, Util, emojis, this);
        return Util.sendError(msg, emojis, 'unknown');
    }

    async onNoPerm() {
        return; // ghost the message, oooo spooky
    }

    async onPermCheck(bot, msg, args, Util, emojis) {
        return true;
    }
}

module.exports = Blacklist;