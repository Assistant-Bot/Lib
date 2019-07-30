class whois {
    constructor() {
        this.name = 'whois';
        this.aliases = ['userinfo', 'w', 'ui'];
        this.description = 'whois @John';
        this.longDescription = 'Show information for the queried user';
        this.list = false;
    }

    async onRun(bot, msg, args, Util, emojis) {

        if (!msg.guild.members.get(bot.user.id).permission.has('embedLinks')) {
            return Util.sendError(msg, emojis, 'perm', 'Embed Links');
        }

        let user;
        let mode = 0;

        if (!args[0]) {
            user = msg.member;
            mode = 1;
        }
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
        let username = user.username + '#' + user.descriminator;
        let create = user.createdAt;

        if (mode == 1) {
            let permissions = Object.keys(user.permission.json).join(', ');
            let status = (emojis[user.status]) ? emojis[user.status] : user.status;
            let nick = (!user.nick) ? 'None' : user.nick;
            let mention = user.mention;
            let game = user.game;
            let roles = msg.guild.roles.filter(r => {
                if (user.roles.includes(r.id)) return r;
            }).sort(function (a, b) {
                a = a.position;
                b = b.position;
                return a > b ? 1 : b > a ? -1 : 0;
            }).map(r => r.name);

            roles = (roles.length > 0) ? roles : 'None';

            let joinedAt = new Date(user.joinedAt).toLocaleDateString('en');
            let nitroBooster = (!user.premiumSince) ? 'Never' : new Date(user.premiumSince).toLocaleDateString('en');
            let color = msg.guild.roles.filter(r => {
                if (user.roles.includes(r.id)) return r;
            }).sort(function (a, b) {
                // Decending
                return a.position > b.position ? -1 : b.position > a.position ? 1 : 0;
            });

            if (!color[0]) color = 0;
            else color = color[0].color;
            
            let em = new Util.SimpleEmbed();
            em.setColor(color);
            em.setAuthor(username, avatar);
            em.setThumbnail(user.avatarURL);
            em.addField('Username', user.username, true);
            em.addField('User ID', user.id, true);
            em.addField('User Mention', mention, true);
            em.addField('User Status', `${status} ${game}`, true);
            em.addField('User Created', new Date(create).toLocaleDateString('en'), true);
            em.addField('Joined Server', joinedAt, true);
            em.addField('Nickname', nick, true);
            em.addField('Nitro Boosting', 'Since ' + nitroBooster, true);
            em.addField('User Roles', roles.slice(0, 30).join(', '), true);
            em.addField('User Permissions', permissions, true);
            return msg.channel.send(em);
        }

        if (mode == 2 || mode == 0) {
            let em = new Util.SimpleEmbed();
            em.setAuthor(username, avatar);
            em.addField('Username', username, true);
            em.addField('User ID', user.id, true);
            em.addField('Joined Discord', new Date(create).toLocaleDateString('en'), true);
            em.setThumbnail(avatar);
            em.setFooter('This user was fetched using the REST api');
            return msg.channel.send(em);
        }

        return new Util.sendError(msg, emojis, 'custom', 'Invalid member');

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