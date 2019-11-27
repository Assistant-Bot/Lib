class Ban {
    constructor() {
        this.name = 'ban',
        this.description = '/ban user reason',
        this.aliases = ['b'];
        this.longDescription = 'Ban a user in the server.';
        this.permission = 0,
        this.list = true;
    }

    async onRun(bot, msg, args, Util, emojis) {
        let wrapped = new Util.Wrapper(args);
        let reason = '';

        if (!wrapped[0]) return msg.channel.send(emojis.redtick + ' You need to provide a user to ban.');
        if (!wrapped[1]) reason = 'No Reason provided';
        else reason = wrapped[1];

        let user = Util.findMember(msg.guild, wrapped[0]);
        let m = await msg.channel.send(emojis.square + ' Administering ban.');

        try {
            if (!user) return m.edit(emojis.redtick + ' Invalid user, make sure you are providing an ID or a member name.');
            console.log(user);
            user = (typeof user == 'number') ? user : user.id; 
            console.log(user);
            let ban = await msg.guild.ban(user);

            if (user == msg.author.id) return m.edit(emojis.redtick + ' You can not ban yourself.');

            m.edit(emojis.check + ` Administered ban for **${ban.user.username}**`);
        } catch (e) {
            console.error(e);
            m.edit(emojis.redtick + ' I could not ban that user.');
        }

    }

    async onNoPerm(bot, msg, args, Util, emojis) {
        return msg.channel.send(emojis.redtick + ' You require `Moderator` permissions to use this command.');
    }

    async onError(bot, msg, args, Util, emojis) {
        Util.logError(bot, msg, args, Util, emojis, this);
        return Util.sendError(msg, emojis, 'unknown');
    }

    async onPermCheck(bot, msg) {
        return msg.member.permission.has('banMembers');
    }
}

module.exports = Ban;
