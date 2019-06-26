const Util = require('../libraries/Assistant/main.js');
const Eris = require('eris');
const config = require('./configuration/config.json');
const emojis = require('./configuration/emojis.js');

/* Initialize the Client */
Util.loadProperties(Eris);
const bot = (config.dev_mode) ? new Eris(config.dev_token, config.eris) : new Eris(config.token, config.eris); //Discord.Client(); 
    bot.emojis = emojis;
    bot.db = new Util.database();
    bot._restClient = (config.dev_mode) ? new Eris(`Bot ${config.dev_token}`, config['eris.rest']) : new Eris(`Bot ${config.token}`, config['eris.rest']);

const commandOptions = new Util.CommandHandler.CommandOptions()
    .setPrefix('dev') // if this has a getPrefix(GUILD ID) : string function, you can use custom prefixes.
    .setCooldown(2000, emojis.redtick + ' You must wait a few seconds to use commands again.')
    .unknownCommands(true, emojis.redtick + ' Command, `{COMMAND}` does not exist.')
    .setClient(bot)
    .loadSubfolders()
    .setOS(0)
    .logMessages(false)
    .setBlacklist(Util.blackList)
    .setVars([Util, emojis]); // only accepts 2 additional args.

try {
    const commandHandler = new Util.CommandHandler(__dirname + '/Commands', commandOptions);
   // const AntiRaid = new Util.AntiRaid(bot); // eventually pass settings
    commandHandler.start(); // USE .start();
   // AntiRaid.initialize();

   // bot.antiraid = AntiRaid;
    bot.commandHandler = commandHandler;
    bot.on('ready', () => { console.log('I am on! :)') });
} catch (e) {
    console.log('An error has occured: ' + e);
    process.exit(403);
}

bot.connect(); //bot.login(config.dev_token); - Eris.JS