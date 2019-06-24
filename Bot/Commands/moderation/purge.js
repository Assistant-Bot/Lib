class Purge {
    constructor() {
        this.name = 'purge';
        this.description = '/purge';
        this.aliases = ['pu'];
        this.longDescription = 'Purge';
        this.permission = 0,
        this.list = true;
    }

    async onRun(bot, msg, args, Util, emojis) {
        let wrapped = new Util.Wrapper(args);
        let m;
        if (!wrapped[0]) return Util.sendError(msg, emojis, 'alias', 'purge');
        
        if (!wrapped[1]) {
            let amount = parseInt(wrapped[0]);
            if (!amount) return Util.sendError(msg, emojis, 'custom', 'Invalid number, **' + wrapped[0] + '** provided.');

            if (amount > 2000) return Util.sendError(msg, emojis, 'custom', 'You can not purge more than 2000 messages at a time.');
            if (!msg.guild.members.get(bot.user.id).permission.has('manageMessages')) return Util.sendError(msg, emojis, 'perm', 'Manage Message');
            try {
                msg.delete();
                await msg.channel.purge(amount);
                msg.channel.send(emojis.greentick + ' Purged `' + amount + '` messages.');
            } catch (e) {
                Util.logError(bot, msg, args, Util, emojis, this, e);
                return Util.sendError(msg, emojis, 'unknown');
            }
        } else return Util.sendError(msg, emojis, 'alias', 'purge');
    }

    async onNoPerm(bot, msg, args, Util, emojis) {
        return Util.sendError(msg, emojis, 'noperm', 'Administrator')
    }

    async onError(bot, msg, args, Util, emojis, e) {
        return msg.channel.send(emojis.redtick + ' I couldn\'t set the channel cooldown: ' + e.message);
    }

    async onPermCheck(bot, msg) {
        if (!msg.member.permission.has('manageMessages')) return false;
        else return true;
    }
}
module.exports = Purge;