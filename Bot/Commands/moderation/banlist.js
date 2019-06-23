class BanList {
    constructor() {
        this.name = 'banlist';
        this.description = '/banlist';
        this.aliases = ['bl'];
        this.longDescription = 'Show the bans for the guild.';
        this.permission = 0,
        this.list = true;
    }

    async onRun(bot, msg, args, Util, emojis) {
        if (!msg.guild.members.get(bot.user.id).permission.has('banMembers')) return Util.sendError(msg, emojis, 'perm', 'Ban Members');
        if (!msg.guild.members.get(bot.user.id).permission.has('embedLinks')) return Util.sendError(msg, emojis, 'perm', 'Embed Links');
        try {
            let m = await msg.channel.send(emojis.loading + ' Gathering bans...');
            let bans = await msg.guild.getBans();
            let pretty = [];
            let i = 1;
            let page = (!args[0]) ? 0 : (!parseInt(args[0])) ? 0 : parseInt(args[0]);
            let cache = bans.length;
            if (page > cache) page = 0;
            if (page < 0) page = 0;
            bans = bans.slice(page, page + 35);
            i = (page > 0) ? page : page + 1;

            await bans.forEach((ban) => {
                pretty.push(`**${i}.)** ` + '__' + ban.user.username + '__ (`' + ban.user.id + ')`');
                i++;
            });

            let em = new Util.SimpleEmbed();
            em.setColor('#fc5928');
            em.setAuthor(msg.guild.name, msg.guild.iconURL);
            em.setTitle('Bans ' + ((page > 0) ? page : page + 1) + ' - ' + (page + 35));
            em.setDescription(pretty.join('\n'));

            m.edit(em);
        } catch (e) {
            Util.logError(bot, msg, args, Util, emojis, this, e);
            return Util.sendError(msg, emojis, 'unknown');
        }
    }

    async onNoPerm(bot, msg, args, Util, emojis) {
        return Util.sendError(msg, emojis, 'perm', 'Ban Members')
    }

    async onError(bot, msg, args, Util, emojis, e) {
        return msg.channel.send(emojis.redtick + ' I couldn\'t set the channel cooldown: ' + e.message);
    }

    async onPermCheck(bot, msg) {
        if (!msg.member.permission.has('banMembers')) return false;
        else return true;
    }
}
module.exports = BanList;