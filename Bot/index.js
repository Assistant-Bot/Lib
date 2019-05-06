const Util = require('./Libraries/DiscordJSPlus/main.js');
const Discord = require('discord.js');
const fs = require('fs');

/* Bot variables */
const bot = new Discord.Client();
const config = require('./configuration/config.json');
let store = {};

bot.commands = new Map();
bot.prefix = config.prefix;
const emojis = require('./configuration/emojis.js');

/* Register permissions */
bot.permissions = {
    0: new Util.Permission((msg) => { return true }),
    1: new Util.Permission((msg) => { return msg.member.hasPermission("MANAGE_MESSAGES") }),
    2: new Util.Permission((msg) => { return msg.member.hasPermission("MANAGE_NICKNAMES") }),
    3: new Util.Permission((msg) => { return msg.member.hasPermission("KICK_MEMBERS") }),
    4: new Util.Permission((msg) => { return msg.member.hasPermission("BAN_MEMBERS") }),
    5: new Util.Permission((msg) => { return config.admins.includes(msg.author.id) }),
    6: new Util.Permission((msg) => { return msg.author.id == '217006264570347520'; })
}
bot.reloadCommands = async function () {
    await bot.commands.forEach(async (data, command, none) => {
        await bot.commands.delete(command)
    });
    await read('src/commands/misc');
    await read('src/commands/moderation');
}

read('src/commands/misc');
read('src/commands/moderation');

bot.on("ready", () => {
    console.log("Bot on");
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
function read(fld, type) {
    fs.readdir("./" + fld + "/", (err, files) => {
        if (err) console.error(err);
        let jsfiles = files.filter(f => f.split(".").pop() === "js")
        jsfiles.forEach(f => {
            let props = require(`./` + fld + `/${f}`);
            delete require.cache[require.resolve(`./` + fld + `/${f}`)];
            if (!props.setup) return console.error(`WARNING: A command in ${fld} (${f}) did not have a setup object, so it couldn't be added. (Ignored Error)`);
            if (!props.setup.name) return console.error(`WARNING: A command in ${fld} did not have a name, so it couldn't be added. (Ignored Error)`);
            bot.commands.set(props.setup.name, props);
            if (!props.setup.aliases) return console.error(`WARNING: ${props.setup.name} was loaded, but no aliases were loaded with it because setup.aliases could not be found`);
            if (Array.isArray(props.setup.aliases) == false) {
                console.error(`WARNING: ${props.setup.name} was loaded but no aliases were loaded with it because the aliases provided was not a array.`);
                return;
            }
            props.setup.aliases.forEach(aliase => {
                bot.commands.set(aliase, props)
                if (type) {
                    if (Array.isArray(type)) type.push(aliase);
                    else console.error(`WARNING: ${props.setup.aliase} successfully loaded but an invalid array was provided.`)
                }
            })
            console.log(`${props.setup.name} loaded successfully with: ${props.setup.aliases.length} aliases!\n|- ${props.setup.aliases.join(' \n|- ')}`)
        });
    });
}