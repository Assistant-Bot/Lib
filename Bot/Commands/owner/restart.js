class Restart {
    constructor() {
        this.name = 'restart';
        this.aliases = [];
        this.description = '/reload [command]';
        this.longDescription = 'Reload commands on the bot.';
        this.list = false;
        this.permission = 10;
    }

    async onRun(bot, msg, args, Util, emojis) {
        let m;

        try {
            m = await msg.channel.send(`${emojis.greentick} Restarting...`);
            process.exit();
        } catch (e) {
            return m.edit(`${emojis.redtick} Restart failed: ${e}`);
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

module.exports = Restart;