const CommandCollection = require('./Classes/CommandCollection');
const util = require('util');
const fs = require('fs');
const Options = require('./Classes/Options');
const Command = require('./Classes/Command');

class CommandHandler {
    /**
     * @param {String} dir 
     * @param {Options} options
     */
    constructor (dir, options) {

        if (!this.resolvable(dir)) throw '[COMMAND-HANDLER]: Could not find directory: ' + dir;
        else this.dir = dir;
        if (!options instanceof Options) throw '[COMMAND-HANDLER]: Invalid options';
        if (!options.token && options.client === false) throw '[COMMAND-HANDLER]: You must provide a token if you don\'t pass a client'; 
        if (options.client == false) {
            this.client = new Discord.Client(options.token);
            this.clientType = 0;
        } else 
            this.detectClient(options.client);

        if (!options.prefix) throw '[COMMAND-HANDLER]: Invalid prefix';
        if (typeof options !== 'string') this.database = options.prefix;
        
        this.options = options;
        this.commands = new CommandCollection();
        this.load = this.start;
        this.clientTypes = {
            0: 'Discord.JS',
            1: 'Eris'
        };
        this.cooldown = new Set();
        this.warned = new Set();
    }

    /**
     * @returns {Client} - Returns a client
     */
    async start() {
        await this.loadCommands();
        await this.registerMessage();
        return this.client;
    }

    /**
     * @returns {Boolean}
     */
    async loadCommands() {
        if (this.options.loadFolders == false) {
            console.log('[COMMAND-HANDLER]: Attempting to load files to cache using FILE ONLY.');
            return this.loadCmds(this.options.loadFolders);
        } else {
            console.log('[COMMAND-HANDLER]: Attempting to load files to cache using SUB-FOLDER RECURSIVE.');
            return this.loadCmds(this.options.loadFolders);
        }
    }

    /**
     * @param {Boolean} subVal - Allow subdirs?
     */
    async loadCmds(subVal) {
        try {
            if (subVal) {
                let types = this.getDirectories(this.dir);
                let loaded  = 0;
                let attempted = 0;
                for (let i = 0; i < types.length; i++) {
                    let type = types[i];
                    let files = this.getFiles(this.dir + '\\' + type);
                    await files.forEach(fl => {
                        attempted++;

                        if (fl.search('.js') == -1) {
                            console.log(`[COMMAND-HANDLER]: ${fl} could not be loaded -> INVALID FILE TYPE. (Error Ignored)`);
                            return;
                        }

                        let cac = fl;
                        fl = require(this.dir + '\\' + type + '\\' + fl);

                        if (!this.isValidCommand(fl)) {
                            console.log(`[COMMAND-HANDLER]: ${cac} could not be loaded -> NOT VALID COMMAND. (Error Ignored)`);
                            return;
                        }

                        if (this.commands.has(fl.name)) {
                            console.log(`[COMMAND-HANDLER]: ${cac} could not be loaded -> EXISTS. (Error Ignored)`);
                            return;
                        }

                        this.properlyLoad(fl, '[COMMAND-HANDLER]: {CMD} loaded with aliases: {ALIAS}!');
                        loaded++;
                    });
                }
                console.log('[COMMAND-HANDLER]: ' + loaded + ' of ' + attempted + ' attempted commands loaded!');
            }
        } catch (e) {
           console.log('[COMMAND-HANDLER]: Commands loading error -> ' + e);
        }
    }

    isValidCommand(cmd) {
        if (typeof cmd !== 'function') return false;

        cmd = new cmd();

        if (typeof cmd.name !== 'string') return false;
        if (typeof cmd.aliases !== 'object') return false;
        if (typeof cmd.permission !== 'number') return false;
        if (typeof cmd.onError !== 'function') return false;
        if (typeof cmd.onRun !== 'function') return false;
        else return true;
    }

    async properlyLoad(cmd, str) {
        cmd = new cmd();
        let cache = cmd;
        let aliases = cmd.aliases;
        let cmdAl = (aliases.length < 1) ? "None" : aliases.join(', ');
        await aliases.forEach(alias => {
            cache.parent = cmd.name.toLowerCase();
            this.commands.set(alias.toLowerCase(), cache);
        });
        
        this.commands.set(cmd.name.toLowerCase(), cmd);
        str = this.replaceAll(str, '{CMD}', cmd.name);
        str = this.replaceAll(str, '{ALIAS}', cmdAl);
        console.log(str);
    }

    /**
     * @returns {Boolean|Array}
     */
    reloadCommands(resetClient=false, client=this.client) {
        if (!this.loaded) throw '[COMMAND-HANDLER]: Commands have not been loaded yet, this may have been a failure.';
        if (!resetClient) {
            this.commands = this.commands.clear();
            return this.loadCommands();
        } else {
            this.commands = this.commands.clear();
            this.client = client;
            this.client.removeListener('message');
            this.registerMessage();
            return this.loadCommands();
        }
    }

    /**
     * @param {Object} client 
     */
    detectClient(client) {
        if (client.login == undefined) throw '[COMMAND-HANDLER]: Invalid client';
        if (client.eventNames == undefined) throw '[COMMAND-HANDLER]: Invalid client';
        if (typeof client.eventNames != 'function') throw '[COMMAND-HANDLER]: Client does not have a valid event listener';
        let events = client.eventNames();
        if (events.includes('messageCreate')) {
            this.clientType = 1;
            this.client = client;
        } else {
            this.clientType = 0;
            this.client = client;
        }
    }

    /**
     * @returns {VoidFunction} - Nothing.
     */
    async registerMessage() {
        //if (util.inspect(this.client.listeners('message')).length >= 1) this.client.removeListener('message');
        if (!this.loaded) this.loaded = true;
        else { 
            this.loadCommands();
            this.loaded = true;
        };
        const listener = (this.clientTypes[this.clientType] == 'Eris') ? 'messageCreate' : 'message';

        let handler = (this.options.customHandler) ? this.options.customHandler : this.default; 
        this.client.on(listener, handler); 
    }

    filterMessage(type, msg) {
        let unfil = type.split(' ');
        let fil = [];

        for (let i = 0; i < unfil.length; i++) {
            let word = unfil[i];
            word = this.replaceAll(word, '{emojis.check}', this.options.emojis.greentick);
            word = this.replaceAll(word, '{user}', msg.author.tag);
            word = this.replaceAll(word, '{mention}', msg.author);
            fil.push(word);
        }

        return fil.join(' ');
    }

    /**
     * @param {String} str - Haystack
     * @param {String} search - Needle
     * @param {String} replace - String
     * @returns {String} Filtered String
     */
    replaceAll(str, search, replace) {
        return str.split(search).join(replace);
    }

    /**
     * @param {String} dir 
     */
    resolvable(dir) {
        if (!fs.existsSync(dir)) return false;
        else return true;
    }


    /**
     * @param {String} path - Directory of listing
     * @returns {Array<String>} Array of diretories
     */

    getDirectories(path) {
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path + '/' + file).isDirectory();
        });
    }

    /**
     * @param {String} path - Directory of listing
     * @returns {Array<String>} Array of files
     */

    getFiles(path) {
        return fs.readdirSync(path).filter(function (file) {
            return !fs.statSync(path + '/' + file).isDirectory();
        });
    }

    /**
     * @var default = Default command handler
     */

     async default (msg) {
         let cc = this.commandHandler;
         let prefix = cc.options.prefix;
         let args = msg.content.slice(prefix.length).trim().split(/ +/g);
         let command = args.shift().toLowerCase();
         if (cc.options.allowBots && msg.author.bot) return;
         if (msg.content.indexOf(prefix) !== 0) return;
         if (cc.options.cooldown > 0) {
             if (cc.cooldown.has(msg.author.id)) {
                 if (cc.warned.has(msg.author.id)) return;
                
                 cc.warned.add(msg.author.id);
                 setTimeout(() => { cc.warned.delete(msg.author.id) }, cc.options.cooldown);
                 return msg.channel.send(cc.options.cooldownMsg);
             } else {
                 cc.cooldown.add(msg.author.id);
                 setTimeout(() => { cc.cooldown.delete(msg.author.id) }, cc.options.cooldown);
             }
         }

         try {
             if (!cc.commands.has(command)) return msg.channel.send('Command non existant (TEMP): ' + command);
             else {
                 let cmd = cc.commands.get(command);
                 if (!cmd.test) return cmd.onRun(cc.client, msg, args, cc.options.vars[0], cc.options.vars[1]);
                 if (!cmd.test(msg)) return cmd.onError(cc.client, msg, args, cc.options.vars[0], cc.options.vars[1]);
                 else return cmd.test(msg, cc.client, msg, args, cc.options.vars[0], cc.options.vars[1]);
             }
         } catch (e) {
             if (!cc.options.errorHandler) {
                 console.error('Assistant CMD Handler: ' + e.message);
                 msg.channel.send('An error occurred when peforming this command.');
             }
         }
     }

}
module.exports = CommandHandler;