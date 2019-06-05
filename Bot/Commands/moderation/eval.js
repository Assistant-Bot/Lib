class Eval {
    constructor () {
        this.name = 'eval';
        this.description = '/eval <code>';
        this.longDescription = 'Evaluate JS code.';
        this.aliases = ['e'];
        this.list = false;
    }

    async onRun (bot, msg, args, Util, emojis) {
        function clean(text) {
            if (typeof (text) === "string")
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }
        try {
            const code = args.join(" ");
            let evaled = eval(code);
            if (typeof evaled !== "string") evaled = require("util").inspect(evaled, { depth: 0 });
            msg.channel.send(clean(evaled), { code: "js" });
        } catch (err) {
            msg.channel.send(`\`\`\`js\n${clean(err)}\n\`\`\``);
        }
    }

    async onError (bot, msg, args, Util, emojis) {
        return msg.channel.send(`${emojis.redtick} Something isn't right, try joining the support server.`);
    }

    async onNoPerm() {
        return; // ghost the message, oooo spooky
    }

    async onPermCheck(bot, msg) {
        if (msg.author.id != '217006264570347520') return false;
        else return true;
    }
}

module.exports = Eval;