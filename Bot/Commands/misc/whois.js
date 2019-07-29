class whois {
    constructor() {
        this.name = 'whois';
        this.aliases = ['userinfo', 'w', 'ui'];
        this.description = 'whois @John';
        this.longDescription = 'Show information for the queried user';
        this.list = false;
    }

    async onRun(bot, msg, args, Util, emojis) {

        if (!msg.guild.members.get(bot.user.id).permissions.has('embedLinks')) {
            return Util.sendError(msg, emojis, 'perm', 'Embed Links');
        }

        let user;
        let mode = 0;

        if (!args[0]) user = msg.author;
        if (args[0]) {
            let toSearch = args.slice(0).join(' ');
            let isGuildMember = Util.findMember(msg.guild, toSearch);
            let lastResort = bot._restClient.getRESTUser(toSearch);

            if (isGuildMember !== false) {
                user = isGuildMember;
                mode = 1;
            } else if (!lastResort) {
                return Util.sendError(msg, emojis, 'custom', 'I could not find that user.');
            } else {
                user = lastResort;
                mode = 2;
            }
        }

        // These are 100% always the same.
        let avatar = user.avatarURL;
        let username = user.tag;
        let create = user.createdAt;

        if (mode == 0) {
            let em = new Util.SimpleEmbed();
            em.setAuthor(username, avatar);
            em.addField('Username', username, true);
            em.addField('User ID', user.id);
            em.addField('Joined Discord', new Date(create).toLocaleDateString('en'), true);
            return msg.channel.send(em);
        }

        msg.channel.send('Cool')

    }

    async onError(bot, msg, args, Util, emojis) {
        Util.logError(bot, msg, args, Util, emojis, this);
        return Util.sendError(msg, emojis, 'unknown');
    }

    async onNoPerm(bot, msg, args, Util, emojis) {
        return Util.sendError(msg, emojis, 'perm', 'Moderator');
    }

    async onPermCheck(bot, msg, args, Util, emojis) {
        return true;
    }
}

module.exports = whois;