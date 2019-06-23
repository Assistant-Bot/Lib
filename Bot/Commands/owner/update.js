class Update {
    constructor() {
        this.name = 'update';
        this.aliases = ['up'];
        this.description = '/update branch';
        this.longDescription = 'Updates bot.';
        this.list = false;
    }

    async onRun(bot, msg, args, Util, emojis) {
        let m, output;
        let branch = 'v1';
        try {
            if (args[0]) branch = args[0]
                m = await msg.channel.send(`${emojis.loading} Attempting to update...`);
                output = await Util.runCommand('git pull ' + branch);
                console.log(output);
            if (typeof output == 'object') return m.edit(emojis.redtick + ' Failed to pull from `' + branch + '`');
             else return m.edit(emojis.greentick + ' Successfully pulled from `' + branch + '` - Restarting');
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

module.exports = Update;