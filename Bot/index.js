const Util = require('../libraries/Assistant/main.js');
const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./configuration/config.json');
const emojis = require('./configuration/emojis.js');
    bot.emojis = emojis;

//const commandDB = Util.commandHandler.database;
const commandOptions = new Util.CommandHandlerOptions()
    .setPrefix('a!') // if this has a getPrefix(GUILD ID) : string function, you can use custom prefixes.
    .setCooldown(3000, emojis.redtick + ' You must wait a few seconds to use commands again.')
    .unknownCommands(true, emojis.redtick + ' Command, `{COMMAND}` does not exist.')
    .setClient(bot)
    .loadSubfolders(true)
    .setVars([Util, emojis]); // only accepts 2 additional args.

try {
    const commandHandler = new Util.CommandHandler(__dirname + '/Commands', commandOptions);
   // const AntiRaid = new Util.AntiRaid(bot); // eventually pass settings
    commandHandler.start(); // USE .start();
   // AntiRaid.initialize();

   // bot.antiraid = AntiRaid;
    bot.commandHandler = commandHandler;
    bot.login(config.dev_token);

    bot.on('ready', () => { console.log('I am on! :)') });
} catch (e) {
    console.log('An error has occured: ' + e);
}