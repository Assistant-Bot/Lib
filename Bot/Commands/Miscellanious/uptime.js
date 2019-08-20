class Uptime {
    constructor() {
        this.name = 'uptime';
        this.description = '/uptime';
        this.aliases = ['up']; 
        this.longDescription = 'Check the uptime of assistant'; 
        this.permission = 0;
        this.list = true;
        this.cooldown = 0;
    }

    async onRun(bot, msg, args, Util, emojis) {
        let temp = process.uptime();
        let days = Math.floor((temp %= 31536000) / 86400);
        let hours = Math.floor((temp %= 86400) / 3600);
        let minutes = Math.floor((temp %= 3600) / 60);
        let seconds = Math.floor(temp % 60);

        days = (days < 1) ? '' : (days === 1) ? '**1** Day ' : `**${days}** Days `;
        hours = (hours < 1) ? '' : (hours === 1) ? '**1** hour ' : `**${hours}** hours `;
        minutes = (minutes < 1) ? '' : (minutes === 1) ? '**1** minute and ' : `**${minutes}** minutes and `;
        seconds = (seconds < 1) ? '' : (days === 1) ? '**1** second' : `**${seconds}** seconds`;

        msg.channel.send(emojis.check + ` **Assistant v2** has been online for: ${days}${hours}${minutes}${seconds}`);
    }

    async onError(bot, msg, args, Util, emojis) {
        Util.logError(bot, msg, args, Util, emojis, this);
        return Util.sendError(msg, emojis, 'unknown');
    }
}

module.exports = Uptime;
