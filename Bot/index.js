const Util = require('./Libraries/DiscordJSPlus/main.js');
const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./configuration/config.json');
const emojis = require('./configuration/emojis.js');

bot.commands = new Map();
bot.prefix = config.prefix;

/* Register permissions */
bot.permissions = {
    0: new Util.Permission(() => { return true }),
    1: new Util.Permission((msg) => { return msg.member.hasPermission("MANAGE_MESSAGES") }),
    2: new Util.Permission((msg) => { return msg.member.hasPermission("MANAGE_NICKNAMES") }),
    3: new Util.Permission((msg) => { return msg.member.hasPermission("KICK_MEMBERS") }),
    4: new Util.Permission((msg) => { return msg.member.hasPermission("BAN_MEMBERS") }),
    5: new Util.Permission((msg) => { return config.admins.includes(msg.author.id) }),
    6: new Util.Permission((msg) => { return msg.author.id == '217006264570347520'; })
}
bot.reloadCommands = async function () { }

bot.on("ready", () => {
    bot.user.setPresence({
        status: 'DND',
        game: {
            type: "WATCHING",
            name: "Assistant v1"
        }
    });
});

bot.on("message", async (msg) => {
    let prefix = config.prefix;
    let args = msg.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    if (msg.author.bot) return;
    if (msg.content.indexOf(prefix) !== 0) return;

    try {
        if (!bot.commands.has(command)) return;
        else {
            let cmd = bot.commands.get(command);
            let permission = bot.permissions[`${cmd.setup.permission}`];
            if (permission.run(msg) === true) return await cmd.run(bot, msg, args, Util, emojis);
            else return msg.channel.send(`${emojis.redtick} **Error:** You are missing permissions to this command.`);
        }
    } catch (e) {
        console.error(e);
        return msg.channel.send(`${emojis.redtick} **Error:** An error occurred when performing this command.`);
    }
});


bot.login(config.token);