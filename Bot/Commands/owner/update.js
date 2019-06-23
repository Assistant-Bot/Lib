class Update {
    constructor() {
        this.name = 'update';
        this.aliases = ['up'];
        this.description = '/update branch';
        this.longDescription = 'Updates bot.';
        this.list = false;
    }

    async onRun(bot, msg, args, Util, emojis) {
        let m;
        let branch = 'master';

        try {
            if (!args[0]) {
                m = await msg.channel.send(`${emojis.square} Attempting to update from \`master\`.`);
                await Util.runCommand('git pull assistant master');
                return m.edit(`${emojis.greentick} Update queued!`);
            } else {
                m = await msg.channel.send(`${emojis.square} Attempting to update from \`${branch}\``);
                let out = await Util.runCommand('git pull assistant ' + branch);
                let pp = Util.gitClean(out);
                return m.edit(`${emojis.greentick} Update queued. ${pp}`);
            }
        } catch (e) {
            return m.edit(`${emojis.redtick} Failed to get updates from \`${branch}\``);
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

module.exports = Reload;