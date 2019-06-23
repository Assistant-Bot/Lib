class db {
    constructor() {
        this.name = 'database';
        this.description = '/db';
        this.longDescription = 'databasef';
        this.aliases = ['db'];
        this.list = false;
    }

    async onRun(bot, msg, args, Util, emojis) {
        console.log('ayy lmao');
        let prefix = await bot.db.getGuild(msg.guild.id);
        console.log(prefix);
        msg.channel.send('I was here');
        msg.channel.send('Found: ' + prefix);
    }

    async onError(bot, msg, args, Util, emojis) {
        return msg.channel.send(`${emojis.redtick} Something isn't right, try joining the support server.`);
    }

    async onNoPerm() {
        return; // ghost the message, oooo spooky
    }

    async onPermCheck(bot, msg) {
        if (msg.author.id != '217006264570347520') return false;
        else return true;
    }
}

module.exports = db;