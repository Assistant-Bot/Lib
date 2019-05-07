const Util = require('./libraries/Assistant/main.js');
const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./configuration/config.json');
const emojis = require('./configuration/emojis.js');
    bot.emojis = emojis;

const commandDB = Util.commandHandler.database;
const commandOptions = new Util.commandHandler.commandOptions()
    .setPrefix('a!')
    .setDatabase(commandDB) // NEEDS TO HAVE A getPrefix(guildID) function.
    .setCooldown(3000)
    .setClient(bot)
    .setVars([ Util, emojis ]);
const commandHandler = new Util.commandHandler(__dirname + '/commands', commandOptions);
const Events = Util.loadEvents(__dirname + '/Events');

bot.commandHandler = commandHandler;
bot.events = Events;
bot.login(config.token);
