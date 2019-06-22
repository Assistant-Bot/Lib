const ms = require('millisecond');
class Eval {
    constructor() {
        this.name = 'idea';
        this.description = '/idea <accept/deny> <user>';
        this.longDescription = 'OWo';
        this.aliases = [];
        this.list = false;
    }

    async onRun(bot, msg, args, Util, emojis) {
        let wrapped = new Util.Wrapper(args);
        msg.delete();
        if (!wrapped[0]) return Util.sendError(msg, emojis, 'alias', 'idea');
        if (!wrapped[1]) return Util.sendError(msg, emojis, 'alias', 'idea');

        let details = (!wrapped[2]) ? 'No Details' : wrapped[2];
        let reason = (!wrapped[3]) ? 'No Reason Provided.' : wrapped[3];

        let accept = (wrapped[0].toLowerCase() == 'accept') ? true : false;
        let user = Util.findMember(msg.guild, wrapped[1]);
    
        if (!user) return Util.sendError(msg, emojis, 'custom', 'Invalid user.');

        let dm = await bot.getDMChannel(user.id);

        if (accept) {
            let em = new Util.SimpleEmbed();
            em.setColor('#45f442');
            em.setAuthor(user.user.username, user.user.avatarURL);
            em.addField('Idea Now In Progress', `**Developer:** ${msg.author.tag}\n **Author:** ${user.user.tag} (\`${user.id}\`)\n**Idea:** ${details}`);
            em.addField('Reason', emojis.greentick + ' ' + reason);
            em.setTimestamp(new Date());
            em.setFooter('Assistant v1 DEV');
            await bot.createMessage(dm.id, ':tada: **Hooray!** An idea of yours was accepted! View it in the support server!');
            return bot.createMessage('591906037217361921', em);
        } else {
            let em = new Util.SimpleEmbed();
            em.setColor('#fc3a3a');
            em.setAuthor(user.user.username, user.user.avatarURL);
            em.addField('Idea Declined', `**Developer:** ${msg.author.tag}\n **Author:** ${user.user.tag} (\`${user.id}\`)\n**Idea:** ${details}`);
            em.addField('Reason', emojis.redtick + ' ' + reason);
            em.setTimestamp(new Date());
            em.setFooter('Assistant v1 DEV');
            await bot.createMessage(dm.id, '**Awe Snap!** An idea of yours was declined... View it in the support server for more info.');
            return bot.createMessage('591906037217361921', em);
        }
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

module.exports = Eval;