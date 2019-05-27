class Ping {
    constructor() {
        this.name = 'ping',
        this.description = '/ping',
        this.aliases = [];
        this.longDescription = 'Check the response time of assistant.';
        this.permission = 0,
        this.list = true;
    }
    
    async onRun (bot, msg, args, Util, emojis) {
        let m = await msg.channel.send(`${emojis.square} Pinging...`);
        let value = m.createdTimestamp - msg.createdTimestamp;
        return m.edit(emojis.greentick + ' Pong! `' + value + '`');
    }
    
    async onError (bot, msg, args, Util, emojis) {
        return msg.channel.send(emojis.redtick + ' You require `default` permissions to use this command.');
    }
}

module.exports = Ping;
