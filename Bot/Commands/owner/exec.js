class Execute {
    constructor() {
        this.name = 'execute';
        this.aliases = ['exec', 'exe'];
        this.description = '/exe';
        this.longDescription = 'None.';
        this.list = false;
    }

    async onRun(bot, msg, args, Util, emojis) {
        let m, output;

        try {
            if (!args[0]) return Util.sendError(msg, emojis, 'alias', 'exe');
            else {
                let cmd = args.slice(0).join(' ');
                m = await msg.channel.send(`${emojis.loading} Running command: \`${cmd}\``);
                output = await Util.runCommand(cmd);

                if (typeof output == 'object')
                return m.edit(emojis.redtick + ' Ran command: `' + cmd + '` but returned an error.\n**Response:**```js\n' + output + '\n```');
                else return m.edit(emojis.greentick + ' Ran command: `' + cmd + '` successfully!\n**Response:**```xl\n'+output+'\n```');
            }
        } catch (e) {
            return m.edit(`${emojis.redtick} Failed to run command: ${e}`);
        }
    }

    async onError(bot, msg, args, Util, emojis) {
        Util.logError(bot, msg, args, Util, emojis, this);
        return Util.sendError(msg, emojis, 'unknown');
    }

    async onNoPerm() {
        return; // ghost the message, oooo spooky
    }

    async onPermCheck(bot, msg, args, Util, emojis) {
        if (msg.author.id != '217006264570347520') return false;
        else return true;
    }
}

module.exports = Execute;