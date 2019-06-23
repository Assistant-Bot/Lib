class Reload {
    constructor () {
        this.name = 'reload';
        this.aliases = ['r'];
        this.description = '/reload [command]';
        this.longDescription = 'Reload commands on the bot.';
        this.list = false;
    }

    async onRun (bot, msg, args, Util, emojis) {
        let m;

        try {
            if (!args[0]) {
                m = await msg.channel.send(`${emojis.square} Attempting to reload command(s): **All**.`);
                await bot.commandHandler.reloadCommands(true);
                return m.edit(`${emojis.greentick} Commands reloaded!`);
            } else {
                m = await msg.channel.send(`${emojis.square} Attempting to reload command(s): **${args[0]}**.`);
                bot.commandHandler.reloadCommand(args[0]);
                return m.edit(`${emojis.greentick} Command **${args[0]}** reloaded!`);
            }
        } catch (e) {
            return m.edit(`${emojis.redtick} When performing the command, I encountered the following error: \`\`\`js\n${e}\`\`\``);
        }
    }
 
    async onError(bot, msg, args, Util, emojis) {
        Util.logError(bot, msg, args, Util, emojis, this);
        return Util.sendError(msg, emojis, 'unknown');
    }

    async onNoPerm () {
        return; // ghost the message, oooo spooky
    }

    async onPermCheck(bot, msg, args, Util, emojis) {
        if (msg.author.id != '217006264570347520') return false;
        else return true;
    }
}

module.exports = Reload;