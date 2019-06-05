class Reload {
    constructor () {
        this.name = 'reload';
        this.aliases = ['r'];
        this.description = '/reload [command]';
        this.longDescription = 'Reload commands on the bot.';
        this.list = false;
    }

    async onRun (bot, msg, args, Util, emojis) {
        try {
            await bot.commandHandler.reloadCommands();
            return msg.channel.send(`${emojis.greentick} Commands reloaded!`);
        } catch (e) {
            return msg.channel.send(`${emojis.redtick} When performing the command, I encountered the following error: \`\`\`xl\n${e}\`\`\``);
        }
    }
 
    async onError (bot, msg, args, Util, emojis) {
        return msg.channel.send(`${emojis.redtick} Something isn't right, try joining the support server.`);
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