class eightball {
    constructor() {
        this.name = '8ball';
        this.description = '/8ball';
        this.aliases = ['8b'];
        this.longDescription = '8ball';
        this.permission = 0,
        this.list = true;
    }

    async onRun(bot, msg, args, Util, emojis) {
        if (!msg.guild.members.get(bot.user.id).permission.has("embedLinks")) return Util.sendError(msg, emojis, 'perm', 'embedLinks');
        if (!args[0]) return msg.channel.send('You need something to 8ball');
        let choices = ["It is certain", "It is decidedly so", "Without a doubt", "Yes - definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Reply hazy, try again", "Signs point to yes", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];
        let em = new Util.SimpleEmbed();
        let response = choices[Math.floor(choices.length * Math.random())];
        em.setColor(msg.member.displayHexColor);
        em.addField('🎱 8ball!', response)
        return msg.channel.send(em);
    }

    async onNoPerm(bot, msg, args, Util, emojis) {
        return msg.channel.send(emojis.redtick + ' You require `default` permissions to use this command.');
    }

    async onError(bot, msg, args, Util, emojis) {
        Util.logError(bot, msg, args, Util, emojis, this);
        return Util.sendError(msg, emojis, 'unknown');
    }
}
module.exports = eightball;