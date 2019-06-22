class RoleColor {
    constructor() {
        this.name = 'rolecolor';
        this.description = '/rolecolor role newColor';
        this.aliases = ['setcolor', 'rc', 'sc', 'rcolor', 'rolec'];
        this.longDescription = 'Change the color of a role.';
        this.permission = 0,
        this.list = true;
    }

    async onRun(bot, msg, args, Util, emojis) {
        let wrapped = new Util.Wrapper(args);
        if (!wrapped[0]) return msg.channel.send(emojis.redtick + ' You need to provide a role name.');
        if (!wrapped[1]) return msg.channel.send(emojis.redtick + ' You need to provide a color.');

        let possible = msg.guild.roles.filter(r => r.name.toLowerCase().search(wrapped[0].toLowerCase()) != -1);
        let roles = possible.map(r => r);
        let color = Util.getColor(wrapped[1]);

        if (possible.size < 1) return msg.channel.send(emojis.redtick + ' Role not found.');
        if (!color) return msg.channel.send(emojis.redtick + ' Color invalid.');
        
        try {
            await msg.guild.roles.get(roles[0].id).setColor(color);
            return msg.channel.send(emojis.greentick + ` Set the color to **${Util.resolveColor(color)}** for the role **${roles[0].name}** (\`${roles[0].id}\`).`);
        } catch (e) {
            console.error(e);
            return msg.channel.send(emojis.redtick + ' I do not have permission to modify this role.');
        }

    }

    async onNoPerm(bot, msg, args, Util, emojis) {
        return msg.channel.send(emojis.redtick + ' You require `default` permissions to use this command.');
    }

    async onError(bot, msg, args, Util, emojis) {
        Util.logError(bot, msg, args, Util, emojis, this);
        return Util.sendError(msg, emojis, 'unknown');
    }

    async onPermCheck (bot, msg) {
        if (!msg.member.hasPermission('ADMINISTRATOR')) return false;
        else return true;
    }
}

module.exports = RoleColor;
