class AntiRaid {
    constructor() {
        this.name = 'antiraid';
        this.description = '/antiraid <setting> [value]';
        this.aliases = ['ar'];
        this.longDescription = 'Setup antiraid.';
        this.permission = 0;
        this.list = true;
    }

    async onRun(bot, msg, args, Util, emojis) {
        let wrapped = new Util.Wrapper(args);

        if (!wrapped[0]) return msg.channel.send(emojis.redtick + ' You need to provide an anti-raid setting.');

        let antiraid = [
            '**enable** - Option to enable antiraid.',
            '**disable** - Option to disable antiraid.',
            '**trigger** - How many times until the antiraid should trigger?',
            '**channel** - Channel where warnings for suspected raids should log.',
            '**autoreport** - Should assistant auto report raiders to discord?',
            '**autoban** - Should assistant autoban raiders?',
            '**lockdown** - Should assistant lockdown the server when a raid is detected?',
            '**ai** - Should assistant use it\'s antiraid AI to detect raids?',
            '**report** - Report a raid that assistant didn\'t detect.'
        ]
        

        if (wrapped[0] == 'help') {
            let em = new Util.SimpleEmbed();
            em.setAuthor('Assistant AntiRaid v1', bot.user.displayAvatarURL);
            em.addField('Settings and Options', antiraid.join('\n'), true);
            em.setColor('#26d1ff');
            return msg.channel.send(em);
        }

        if (wrapped[0] == 'enable') {
            return msg.channel.send(emojis.redtick + ' Sorry but, this guild is unauthorized to use the antiraid.');
        }
        if (wrapped[0] == 'disable') {
            return msg.channel.send(emojis.redtick + ' Sorry but, this guild is unauthorized to use the antiraid.');
        }
        if (wrapped[0] == 'trigger') {
            return msg.channel.send(emojis.redtick + ' Sorry but, this guild is unauthorized to use the antiraid.');
        }
        if (wrapped[0] == 'channel') {
            return msg.channel.send(emojis.redtick + ' Sorry but, this guild is unauthorized to use the antiraid.');
        }
        if (wrapped[0] == 'autoreport') {
            return msg.channel.send(emojis.redtick + ' Sorry but, this guild is unauthorized to use the antiraid.');
        }
        if (wrapped[0] == 'autoban') {
            return msg.channel.send(emojis.redtick + ' Sorry but, this guild is unauthorized to use the antiraid.');
        }
        if (wrapped[0] == 'lockdown') {
            return msg.channel.send(emojis.redtick + ' Sorry but, this guild is unauthorized to use the antiraid.');
        }
        if (wrapped[0] == 'ai') {
            return msg.channel.send(emojis.redtick + ' Sorry but, this guild is unauthorized to use the antiraid.');
        }
        if (wrapped[0] == 'report') {
            return msg.channel.send(emojis.redtick + ' Sorry but, this guild is unauthorized to use the antiraid.');
        }

        return msg.channel.send(emojis.redtick + ' Invalid setting, try using `a!antiraid help`.');
        
    }

    async onNoPerm(bot, msg, args, Util, emojis) {
        return msg.channel.send(emojis.redtick + ' You require `Assistant.Owner` permissions to use this command.');
    }

    async onError(bot, msg, args, Util, emojis) {
        return msg.channel.send(emojis.redtick + ' An error has occurred, join the support server if the problem persists.');
    }

    async onPermCheck(bot, msg) {
        if (msg.author.id !== '217006264570347520') return false;
        else return true;
    }
}

module.exports = AntiRaid;
