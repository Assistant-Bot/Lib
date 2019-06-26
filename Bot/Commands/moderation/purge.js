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
                await msg.channel.purge(amount + 1);
                msg.channel.send(emojis.greentick + ' Purged `' + amount + '` messages.');
            } catch (e) {
                Util.logError(bot, msg, args, Util, emojis, this, e);
                return Util.sendError(msg, emojis, 'unknown');
            }
        } else if (wrapped[1]) {
            let amount = (!wrapped[0]) ? 100 : (!parseInt(wrapped[0])) ? 100 : parseInt(wrapped[0]);
            try {
                if (amount > 2000) return Util.sendError(msg, emojis, 'custom', 'You can not purge more than 2000 messages at a time.');
                if (wrapped[1] == 'bots' || wrapped[1] == 'bot') {
                    let i_ = 0;
                    let am = await msg.channel.purge(-1, (m) => {
                        if (amount == i_) return false;
                        if (m.author.bot) {
                            i_++;
                            return true;
                        } else return false
                    });
                    return msg.channel.send(emojis.greentick + ' Purged `' + am + '` messages.');
                }
                if (wrapped[1] == 'clean') {
                    let i_ = 0;
                    let am = await msg.channel.purge(-1, (m) => {
                        let locale = 0;
                        let common = ['!', 'a!', '!<', 'c!', '/', '>', '<', ';', ':', '"', '`', '@', '#'];
                        if (amount == i_) return false;
                        if (m.author.bot) {
                            i_++;
                            return true;
                        } 
                        for (locale; locale < common.length; locale++) {
                            let index = common[locale];
                            if (m.content.toLowerCase().search(index) != -1) return true;
                            continue;
                        } return false;
                    });
                    return msg.channel.send(emojis.greentick + ' Purged `' + am + '` messages.');
                }
                return Util.sendError(msg, emojis, 'custom', 'Invalid option provided. Use `help purge` for usage.');
                
            } catch (e) {
                this.onError(bot, msg, args, Util, emojis, e);
            }          
        } else {
            if (!wrapped[0]) return Util.sendError(msg, emojis, 'alias', 'purge');
        }
    }

    async onNoPerm(bot, msg, args, Util, emojis) {
        return Util.sendError(msg, emojis, 'noperm', 'Manage Messages')
    }

    async onError(bot, msg, args, Util, emojis, e) {
        Util.logError(bot, msg, args, Util, emojis, this, e);
        return msg.channel.send(emojis.red_x + ' An internal error occured.');
    }

    async onPermCheck(bot, msg) {
        if (!msg.member.permission.has('manageMessages')) return false;
        else return true;
    }
}
module.exports = Purge;