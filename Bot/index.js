const Util = require('../libraries/Assistant/main.js');
const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./configuration/config.json');
const emojis = require('./configuration/emojis.js');
    bot.emojis = emojis;

//const commandDB = Util.commandHandler.database;
const commandOptions = new Util.CommandHandlerOptions()
    .setPrefix('a!')
    .setCooldown(3000, emojis.redtick + ' You are using commands to fast.')
    .setClient(bot)
    .loadSubfolders(true)
    .setVars([Util, emojis]); // only accepts 2 additional args.

try {
    const commandHandler = new Util.CommandHandler(__dirname + '/Commands', commandOptions);
    commandHandler.start(); // USE .start();

    bot.commandHandler = commandHandler;
    //bot.events = Events;
    bot.login(config.dev_token);

    bot.on('ready', () => { console.log('I am on! :)') });
} catch (e) {
    console.log('An error has occured: ' + e);
}