function title(str) {
    let twords = ["of", "the", "is", "and"];
    let arr = str.split(" ");
    let newarr = [];
    arr.forEach(e => {
        if (twords.includes(e)) return newarr.push(e);
        e = e[0].toUpperCase() + e.slice(1, e.length);
        return newarr.push(e);
    })
    return newarr.join(" ");
}

class Help {
    constructor () {
        this.name = 'help';
        this.description = '/help';
        this.aliases = ['h'];
        this.longDescription = 'Show useful information on how to use commands!';
        this.usage = [
            '**/help ban** - Shows detailed information on the ban command',
            '**/help help** - Shows detailed information for help, why would you need to do that?',
            '**/help prefix -perms** - Shows the permissions required to use prefix in your server.',
            '**/help prefix -bugs** - Shows a list of known bugs with a given command.',
            '**/help misc** - Shows a list of commands and detailed information about a specific assistant module.',
            '**/help misc -recent** - Shows a list of recent updates to the miscellanious module.'
        ];
        this.permission = 0;
        this.list = true;
        this.cooldown = 0;
    }

    async onRun(bot, msg, args, Util, emojis) {
        if (!args[0]) {
            let parents = bot.commandHandler.commands.find((c, cmd) => {
                if (c !== cmd.name) return false;
                if (!cmd.list) return false; 
                else return true;
            }).map(c => c[1]);

            let categories = this.unDupe(parents.map(c => c.category));
            let em = new Util.SimpleEmbed();
            em.setColor('#26d1ff');
            em.setAuthor(bot.user.username, bot.user.avatarURL);
            em.setTitle('Assistant v2 - Help and Command Menu');
            em.setDescription('This menu is breif, and only shows a list of commands. For more information on a command use `help <command>`. Alternatively, you can set assistant up using our [site](https://assistantbot.net/)');
            
            for (let i = 0; i < categories.length; i++) {
                let commands = parents.filter((cmd) => {
                    return cmd.category === categories[i];
                }).map(c => c.name);

                if (em.hasField(25)) continue; // NO MORE THAN 25 FIELDS

                let cat = title(categories[i]);
                em.addField(`${cat} [${commands.length}]`, commands.join(', '));
            }

            msg.channel.send(em);
        } else {
            const cmd = args[0].toLowerCase();
            const command = bot.commandHandler.commands.get(cmd);
            if (!command) return Util.sendError(msg, emojis, 'custom', 'Sorry! But that command is non-existant, or you don\'t have permission to view it.');

            // Get the permission for the command
            const data = this.buildHelp(command);
            const embed = new Util.SimpleEmbed();

            if (command.onPermCheck) {
                if (!command.onPermCheck(bot, msg, args, Util, emojis)) {
                    return Util.sendError(msg, emojis, 'custom', 'Sorry! But that command is non-existant, or you don\'t have permission to view it.');
                }
            }
            if (command.list === false && msg.author.id !== '217006264570347520') return Util.sendError(msg, emojis, 'custom', 'Sorry! But that command is non-existant, or you don\'t have permission to view it.');
            embed.setAuthor(bot.user.username, bot.user.avatarURL);
            embed.setColor('#26d1ff');
            embed.setTitle(`Help [${data.category}]` + ' - ' + title(data.parent));
            embed.addField('Aliases', data.aliases, true);
            embed.addField('Information', data.description, true);
            embed.addField('Description', data.longDescription, true);
            embed.addField('Usage', data.usage, true);
            embed.addField('More Help', `**Site:** [${data.parent}](https://assistantbot.net/commands/${data.parent})\n**Support:** https://discord.gg/FKTrmsK`, true);
            return msg.channel.send(embed);
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

    buildHelp(cmd) {
        let data = {};
        data.parent = cmd.name;
        data.aliases = (!cmd.aliases || cmd.aliases.length < 1) ? 'No Aliases for this command.' : 'a!' + cmd.aliases.join(', a!');
        data.description = (!cmd.description) ? 'No description for this command.' : cmd.description;
        data.longDescription = (!cmd.longDescription) ? 'No detailed description for this command.' : cmd.longDescription;
        data.usage = (!cmd.usage || typeof cmd.usage !== 'object') ? 'No usage details for this command.' : cmd.usage.join('\n');
        data.category = cmd.category;
        return data;
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