class serverinfo {
    constructor() {
        this.name = 'serverinfo';
        this.aliases = ['si', 'sinfo'];
        this.description = 'serverinfo';
        this.longDescription = 'Show information for the queried user';
        this.list = true;
    }

    async onRun(bot, msg, args, Util, emojis) {

        if (!msg.guild.members.get(bot.user.id).permission.has('embedLinks')) {
            return Util.sendError(msg, emojis, 'perm', 'Embed Links');
        }

        /* Basic Information */
        const g = msg.guild;
        let roles = g.roles.map(r => r.name);
        let members = g.members.map(m => m);
        let owner = g.members.get(g.ownerID);

        /* Depth Information */
        let verif;
        let nitro = {
            level: g.premiumTier,
            boosts: g.premiumSuscriptionCount
        }

        return new Util.sendError(msg, emojis, 'custom', 'Error - Void Loop');

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

module.exports = serverinfo;