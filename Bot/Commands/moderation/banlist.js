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
        let wrapped = new Util.Wrapper(args);
        try {
            if (!args[0] || (parseInt(args[0]) && args[0].length < 18)) {
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

                m.edit({
                    content: emojis.greentick + ' Found: **' + cache + '** bans!',
                    embed: em.embed
                });
            } else {
                let user = wrapped[0];
                if (!parseInt(user)) {
                    let bans = await msg.guild.getBans();
                    let found = await bans.filter(b => {
                        let u = b.user.username + '#' + b.user.discriminator;
                        if (u.search(user) != -1) return true;
                        else return false;
                    });
                    if (found.length < 1) return Util.sendError(msg, emojis, 'custom', 'I could not find a ban for that search.');
                    if (found.length > 1) Util.sendError(msg, emojis, 'warn', 'I found multiple bans for this search, returning the first one.');
                    let em = new Util.SimpleEmbed();
                    em.setColor('#fc5928');
                    em.setAuthor(found[0].user.username, Util.resolveAvatar(found[0].user));
                    em.setTitle('Showing ban for ' + found[0]);
                    em.addField('User', `**Username:** ${found[0].user.username}#${found[0].user.discriminator}\n**ID:** ${found[0].user.id}\n**Avatar:** [Click Here](${Util.resolveAvatar(found[0].user)})`);
                    em.addField('Reason', found[0].reason);
                    em.setFooter('Assitant v2', bot.user.avatarURl);
                    return msg.channel.send(em);
                } else {
                    let ban = await msg.guild.getBan(parseInt(user));
                    return msg.channel.send('```json\n' + ban + '\n```');
                    let em = new Util.SimpleEmbed();
                    em.setColor('#fc5928');
                    em.setAuthor(ban.user.username, Util.resolveAvatar(ban.user));
                    em.setTitle('Showing ban for ' + ban.user.username);
                    em.addField('User', `**Username:** ${ban.user.username}#${ban.user.discriminator}\n**ID:** ${ban.user.id}\n**Avatar:** [Click Here](${Util.resolveAvatar(ban.user)})`);
                    em.addField('Reason', ban.reason);
                    em.setFooter('Assitant v2', bot.user.avatarURl);
                    return msg.channel.send(em);
                }
            }
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