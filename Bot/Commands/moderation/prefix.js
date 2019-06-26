class Prefix {
    constructor() {
        this.name = 'prefix';
        this.aliases = [];
        this.description = '/prefix [prefix]';
        this.longDescription = 'Change the prefix';
        this.list = false;
    }

    async onRun(bot, msg, args, Util, emojis) {
        let m;
        try {
            if (!args[0]) return Util.sendError(msg, emojis, 'usage', 'prefix');
            if (args[0].length > 3) return Util.sendError(msg, emojis, 'custom', 'You can not set a prefix larger than **3** characters.');
            m = await msg.channel.send(`${emojis.empty} Setting prefix to: \`${args[0]}\``);
            let pre = await bot.db.updatePrefix(msg.guild.id, args[0]);
            if (pre == null) m.edit(`${emojis.redtick} I could not set your prefix.`);
            return m.edit(`${emojis.greentick} Changed prefix to: \`${args[0]}\``);
        } catch (e) {
            return Util.sendError(msg, emojis, 'unknown');
        }
    }

    async onError(bot, msg, args, Util, emojis) {
        Util.logError(bot, msg, args, Util, emojis, this);
        return Util.sendError(msg, emojis, 'unknown');
    }

    async onNoPerm(bot, msg, args, Util, emojis) {
        return Util.sendError(msg, emojis, 'perm', 'Moderator');
    }

    async onPermCheck(bot, msg, args, Util, emojis) {
        if (msg.author.id != '217006264570347520') return false;
        else return true;
    }
}

module.exports = Prefix;