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
            if (wrapped[0] == 'view') {
                let blacklisted = Util.blacklist('0', 4);
                let clean = [];
                let keys = Object.keys(blacklisted);
                let i = 0;
                await keys.forEach((key) => {
                    i++;
                    let ob = blacklisted[ob];
                    clean.push(`**${i}.)** __${key}__ - **M** (${ob.mod})`);
                });

                let em = new Util.SimpleEmbed();
                em.setColor('#ff0000');
                em.setTitle('All blacklisted users');
                em.setDescription(clean.join('\n'));
            }

            if (wrapped[1] == 'add') {
                if (!wrapped[2]) return Util.sendError(msg, emojis, 'custom', 'Invalid user.');
                let reason = (!wrapped[3]) ? "No reason provided" : wrapped[3];
                Util.blacklist(wrapped[2], 0, msg.author.id, reason);
                return msg.channel.send(emojis.greentick + ' Successfully blacklisted `' + wrapped[0] + '` with reason: `' + reason + '`');
            }
            if (wrapped[1] == 'remove') {
                if (!wrapped[2]) return Util.sendError(msg, emojis, 'custom', 'Invalid user.');
                let reason = (!wrapped[3]) ? "No reason provided" : wrapped[3];
                Util.blacklist(wrapped[2], 1, msg.author.id, reason);
                return msg.channel.send(emojis.greentick + ' Successfully unblacklisted `' + wrapped[0] + '` with reason: `' + reason + '`');
            }
            return Util.sendError(msg, emojis, 'custom', '**Usage:** a!blacklist <add/remove/view> [id] [reason]');
        } catch (e) {
            return m.edit(`${emojis.redtick} Failed to run command: ${e}`);
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
        if (msg.author.id != '217006264570347520') return false;
        else return true;
    }
}

module.exports = Blacklist;