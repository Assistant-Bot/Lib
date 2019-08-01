class Help {
    constructor () {
        this.name = 'help';
        this.description = '/help';
        this.aliases = ['h'];
        this.longDescription = 'Show useful information on how to use commands!';
        this.permission = 0;
        this.list = true;
        this.cooldown = 0;
    }

    async onRun(bot, msg, args, Util, emojis) {
        if (!args[0]) {
            let parents = bot.commandHandler.commands.find((c, cmd) => {
                if (c !== cmd.name) return false;
                else return true;
            }).map(c => c[1]);

            let categories = this.unDupe(parents.map(c => c.category));
            let em = new Util.SimpleEmbed();
            em.setColor('#26d1ff');
            em.setAuthor(bot.user.username, bot.user.avatarURL);
            em.setTitle('Assistant v2 - Help and Command Menu');
            em.setDescription('This menu is breif, and only shows a list of commands. For more information on a command use `help <command>`.');
            
            for (let i = 0; i < categories.length; i++) {
                let commands = parents.filter((cmd) => {
                    cmd.category === categories[i]
                }).map(c => c.name.title());

                if (em.hasField(25)) continue; // NO MORE THAN 25 FIELDS

                let cat = categories[i].title();
                em.addField(cat, commands);
            }

            msg.channel.send(em);
        } else {
            return Util.sendError(msg, emojis, 'custom', 'This has not been implemented yet.');
        }
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

    unDupe(arr) {
        let seen = [];
        for (let i = 0; i < arr.length; i++) {
            let element = arr[i];
            if (seen.includes(element)) continue;
            else seen.push(element);
        }

        return seen;
    }
}

module.exports = Help;