class Ping {
    constructor() {
        this.name = 'ping'; // Name of the command AKA normal name of cmd.
        this.description = '/ping'; // Short description on how the command is used.
        this.aliases = ['p']; // Aliases! What other names should this command run on?
        this.longDescription = 'Check the response time of assistant.'; // Long description of the command.
        this.permission = 0; // Permissions to use the command (Optional, you can refer to other methods by refferring to documentation)
        this.list = true; // Should we list the command in the help menu
        this.cooldown = 0; // Seconds
    }
    
    async onRun (bot, msg, args, Util, emojis) {
        let m = await msg.channel.send(`${emojis.square} Pinging...`);
        let value = m.timestamp - msg.timestamp;
        return m.edit(emojis.greentick + ' Pong! `' + value + '` ms.');
    }
    
    async onError(bot, msg, args, Util, emojis) {
        Util.logError(bot, msg, args, Util, emojis, this);
        return Util.sendError(msg, emojis, 'unknown');
    }
}

module.exports = Ping;
