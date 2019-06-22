const ms = require('millisecond');
class SlowMode {
    constructor() {
        this.name = 'slowmode';
        this.description = '/rolecolor role newColor';
        this.aliases = ['setcooldown', 'chatcooldown', 'sm', 'setslowmode'];
        this.longDescription = 'Slowmode';
        this.permission = 0,
        this.list = true;
    }

    async onRun(bot, msg, args, Util, emojis) {
        if (!args[0]) {
            let curr = msg.channel.rateLimitPerUser;
            let c = (curr == 0) ? "Off" : curr + ' seconds';
            return msg.channel.send(emojis.greentick + ' The slowmode for this channel is set to: **' + c + '**.');
        }
        let time = this.getTime(args.slice(0).join(' '));
        try {
            await msg.channel.edit({rateLimitPerUser: time.intVal});
            return msg.channel.send(emojis.greentick + ' I set the cooldown in: **#' + msg.channel.name + '** to **' + time.txt + '**');
        } catch (e) {
            return this.onError(bot, msg, args, Util, emojis, e);
        }
    }

    async onNoPerm(bot, msg, args, Util, emojis) {
        return msg.channel.send(emojis.redtick + ' You require `default` permissions to use this command.');
    }

    async onError(bot, msg, args, Util, emojis, e) {
        return msg.channel.send(emojis.redtick + ' I couldn\'t set the channel cooldown: ' + e.message);
    }

    async onPermCheck(bot, msg) {
        if (!msg.member.hasPermission('ADMINISTRATOR')) return false;
        else return true;
    }

    getTime(str) {
        let arr = str.split('and');
        let res = {
            intVal: 0,
            txt: 'Off'
        };

        if (arr.length < 1) {
            if (ms(str) == 0) return res;
            else {
                res.intVal = ms(str) / 1000;
                res.txt = str;
                return res;
            }
        } else {
            let time = 0;
            let last;
            arr = str.trim().split('and');

            for (let i = 0; i < arr.length; i++) {
                let val = arr[i];
                val = val.trim();
                if (val == 'and') continue;
                if (val == ' ') continue;
                else {
                    if (ms(val) == 0) continue;
                    else {
                        time += (ms(val) / 1000);
                        continue;
                    }
                }
            }
            console
            if (time == 0) return res;
            else {
               res.intVal = time;
               res.txt = str;
               return res;
            }
        }
    }
}

module.exports = SlowMode;
