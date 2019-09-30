class Ignore {
    constructor() {
        this.name = 'ignore';
        this.aliases = [];
        this.description = '/ignore <channel/user>';
        this.longDescription = 'Ignore a user / channel in a server.';
        this.list = false;
    }

    async onRun(bot, msg, args, Util, emojis) {
            let pre = await bot.db.updateIgnore(msg.guild.id, args[0]);
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

module.exports = Ignore;