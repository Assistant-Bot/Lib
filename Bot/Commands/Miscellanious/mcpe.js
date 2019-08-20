const mcpef = require('mcpe-ping-fixed');

class mcpe {
    constructor() {
        this.name = 'mcpe';
        this.description = '/mcpe';
        this.aliases = [];
        this.longDescription = 'F';
        this.permission = 0;
        this.list = true;
        this.cooldown = 0;
    }

    async onRun(bot, msg, args, Util, emojis) {
        if (!args[0]) return Util.sendError(msg, emojis, 'alias', 'mcpe');
        
        let server = args[0].split(':')[0];
        let port = (args[0].split(':').length > 1) ? parseInt(args[0].split(':')[1]) : 19132;
        
        mcpef(server, port, async (err, res) => {
            if (err) {
                return Util.sendError(msg, emojis, 'custom', 'I could not connect to that server.');
            } else {
                return msg.channel.send('```json\n' + JSON.stringify(res) + '\n```');
            }
        });
    }

    async onError(bot, msg, args, Util, emojis) {
        Util.logError(bot, msg, args, Util, emojis, this);
        return Util.sendError(msg, emojis, 'unknown');
    }
}

module.exports = mcpe;