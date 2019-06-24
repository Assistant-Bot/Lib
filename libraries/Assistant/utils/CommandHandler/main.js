/**
 * @author John.#9309
 * @toDo Work on per-command cooldown & perm ints
 */

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
        if (typeof options.prefix !== 'string') this.database = options.prefix;
        if (this.database) {
            if (!this.database.getPrefix) throw '[COMMAND-HANDLER]: Database must include .getPrefix()';
            if (!this.database.createGuild) throw '[COMMAND-HANDLER]: Database must include .createGuild()';
            let response = this.database.getPrefix('0');
            if (typeof response == 'object') {
                console.warn('[COMMAND-HANDLER]: Database could not check output, will error in future.');
            } else if (response !== false || response !== null || typeof response !== 'string') throw '[COMMAND-HANDLER]: Database must return false, null, or string.';
            else console.log('[COMMAND-HANDLER]: Database loaded.');
        }
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

    async loadCommands(silent=false) {
        if (this.options.loadFolders == false) {
            if (!silent) console.log('[COMMAND-HANDLER]: Attempting to load files to cache using FILE ONLY.');
            return this.loadCmds(this.options.loadFolders, silent);
        } else {
            if (!silent) console.log('[COMMAND-HANDLER]: Attempting to load files to cache using SUB-FOLDER RECURSIVE.');
            return this.loadCmds(this.options.loadFolders, silent);
        }
    }

    /**
     * @param {Boolean} subVal - Allow subdirs?
     * @param {Boolean} silent - Log to console?
     */

    async loadCmds(subVal, silent=false) {
        try {
            if (subVal) {
                let types = this.getDirectories(this.dir);
                let loaded  = 0;
                let attempted = 0;
                for (let i = 0; i < types.length; i++) {
                    let type = types[i];
                    let files;
                    if (this.options.os == 1) files = this.getFiles(this.dir + '/' + type);
                    else files = this.getFiles(this.dir + '\\' + type);
                    
                    await files.forEach(fl => {
                        attempted++;

                        if (fl.search('.js') == -1) {
                            if (!silent) console.log(`[COMMAND-HANDLER]: ${fl} could not be loaded -> INVALID FILE TYPE. (Error Ignored)`);
                            return;
                        }

                        let cac = fl;
                        if (this.options.os == 0) fl = require(this.dir + '\\' + type + '\\' + fl);
                        else fl = require(this.dir + '/' + type + '/' + fl);
                        
                        if (!this.isValidCommand(fl)) {
                            if (!silent) console.log(`[COMMAND-HANDLER]: ${cac} could not be loaded -> NOT VALID COMMAND. (Error Ignored)`);
                            return;
                        }

                        if (this.commands.has(fl.name)) {
                            if (!silent) console.log(`[COMMAND-HANDLER]: ${cac} could not be loaded -> EXISTS. (Error Ignored)`);
                            return;
                        }

                        this.register(fl, this.dir + '/' + type, '[COMMAND-HANDLER]: {CMD} loaded with aliases: {ALIAS}!');
                        loaded++;
                    });
                }
                if (!silent) console.log('[COMMAND-HANDLER]: ' + loaded + ' of ' + attempted + ' attempted commands loaded!');
            } else {
                let type = types[i];
                let files;
                let loaded = 0;
                let attempted = 0;
                if (this.options.os == 1) files = this.getFiles(this.dir + '/' + type);
                else files = this.getFiles(this.dir + '\\' + type);
                await files.forEach(fl => {
                    attempted++;

                    if (fl.search('.js') == -1) {
                        if (!silent) console.log(`[COMMAND-HANDLER]: ${fl} could not be loaded -> INVALID FILE TYPE. (Error Ignored)`);
                        return;
                    }

                    let cac = fl;
                    if (this.options.os == 0) fl = require(this.dir + '\\' + type + '\\' + fl);
                    else fl = require(this.dir + '/' + type + '/' + fl);

                    if (!this.isValidCommand(fl)) {
                        if (!silent) console.log(`[COMMAND-HANDLER]: ${cac} could not be loaded -> NOT VALID COMMAND. (Error Ignored)`);
                        return;
                    }

                    if (this.commands.has(fl.name)) {
                        if (!silent) console.log(`[COMMAND-HANDLER]: ${cac} could not be loaded -> EXISTS. (Error Ignored)`);
                        return;
                    }

                    this.register(fl, this.dir + '/', '[COMMAND-HANDLER]: {CMD} loaded with aliases: {ALIAS}!');
                    loaded++;
                });
                if (!silent) console.log('[COMMAND-HANDLER]: ' + loaded + ' of ' + attempted + ' attempted commands loaded!');
            }
        } catch (e) {
           console.log('[COMMAND-HANDLER]: Commands loading error -> ' + e);
        }
    }

    /**
     * @param {String} cmd - Command Name
     * @param {String} dir - Command Directory
     */

    loadCommand(cmd, dir) {
        let fl = require(dir + '/' + cmd);

        if (!this.isValidCommand(fl)) {
            return 1;
        }

        if (this.commands.has(fl.name)) {
            return 2;
        }

        return this.register(fl, dir);
    }

    isValidCommand(cmd) {
        if (typeof cmd !== 'function') return false;

        cmd = new cmd();

        if (typeof cmd.name !== 'string') return false;
        if (typeof cmd.aliases !== 'object') return false;
        if (typeof cmd.onError !== 'function') return false;
        if (typeof cmd.onRun !== 'function') return false;
        else return true;
    }

    async register(cmd, type, str) {
        cmd = new cmd();
        let cache = cmd;
        let aliases = cmd.aliases;
        let cmdAl = (aliases.length < 1) ? "None" : aliases.join(', ');
        await aliases.forEach(alias => {
            cache.parent = cmd.name.toLowerCase();
            this.commands.set(alias.toLowerCase(), cache);
        });
        cmd.dir = type;
        this.commands.set(cmd.name.toLowerCase(), cmd);

        if (!str) return;

        str = this.replaceAll(str, '{CMD}', cmd.name);
        str = this.replaceAll(str, '{ALIAS}', cmdAl);
        if (this.options.logMessages == false) return;
        else return console.log(str);
    }

    /**
     * @param {String} command - Command name
     */

    unregister(command) {
        try {
            return this.commands.delete(command);
        } catch (e) {
            return e;
        }
    }

    /**
     * @returns {Boolean|Array}
     */

    async reloadCommands(silent=false, resetClient=false, client=this.client) {
        let unloaded = 0;
        if (!this.loaded) throw '[COMMAND-HANDLER]: Commands have not been loaded yet, this may have been a failure.';
        if (!resetClient) {
            await this.commands.forEachKey(async k => {
                let cmd = this.commands.get(k);
                await this.commands.delete(k);
                if (cmd.parent && cmd.parent !== k) return;
                await delete require.cache[require.resolve(cmd.dir + '/' + k + '.js')];
                unloaded++;
            });
            if (this.options.logMessages !== false) console.log('[COMMAND-HANDLER]: Unloaded ' + unloaded + ' commands.');
            return this.loadCommands(silent);
        } else {
            await this.commands.forEachKey(async k => {
                let cmd = this.commands.get(k);
                await this.commands.delete(k);
                if (cmd.parent && cmd.parent !== k) return;
                await delete require.cache[require.resolve(cmd.dir + '/' + k + '.js')];
                unloaded++
            });
            if (this.options.logMessages !== false) console.log('[COMMAND-HANDLER]: Unloaded ' + unloaded + ' commands.');
            this.client = client;
            this.client.removeListener(this.handler);
            this.registerMessage();
            return this.loadCommands(silent);
        }
    }

    reloadCommand(name) {
        name = name.toLowerCase();

        try {
            if (!this.commands.has(name)) return false;
            let cmd = this.commands.get(name);
            this.commands.delete(name);

            if (cmd.parent && cmd.parent !== name) name = cmd.parent.name
            delete require.cache[require.resolve(cmd.dir + '/' + name + '.js')];

            this.loadCommand(name, cmd.dir);
            return true;
        } catch (e) {
            return false;
        }
        
    }


    /**
     * @param {Object} client 
     */

    detectClient(client) {
        // if (client.login == undefined) throw '[COMMAND-HANDLER]: Invalid client'; - DISABLE DISCORD.JS ONLY CHECK
        if (client.eventNames == undefined) throw '[COMMAND-HANDLER]: Invalid client';
        if (typeof client.eventNames != 'function') throw '[COMMAND-HANDLER]: Client does not have a valid event listener';

        if (client.options.disableEveryone !== undefined) {
            this.clientType = 1;
            this.client = client;
            return this.clientType;
        } else {
            this.clientType = 0;
            this.client = client;
            return this.clientType; 
        }
    }

    /**
     * @returns {VoidFunction} - Nothing.
     */

    async registerMessage() {
        if (!this.loaded) this.loaded = true;
        else { 
            this.loadCommands();
            this.loaded = true;
        };
        const listener = (this.clientTypes[this.clientType] == 'Eris') ? 'messageCreate' : 'message';

        this.handler = (this.options.customHandler) ? this.options.customHandler : this.default; 
        this.client.on(listener, this.handler); 
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
         if (typeof prefix == 'function') {
             try {
                 let response = await prefix.getPrefix(msg.guild.id);
                 if (response == false || response == null) {
                     await prefix.createGuild(msg.guild.id);
                     response = await prefix.getPrefix(msg.guild.id);
                     if (response == false || response == null) throw 'Prefix could not be resolved.';
                 };
                 if (typeof response !== 'string') return;
                 prefix = response;
             } catch (e) {
                 console.log('[COMMAND-HANDLER]: Unknown prefix error: ' + e);
             }
         }
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
             if (this.options.blacklistFunction(msg.author.id)) return;
             if (!cc.commands.has(command)) {
                 if (cc.options.resToUnk == true)
                    return msg.channel.send(cc.replaceAll(cc.options.resMsg, '{COMMAND}', command));
                 else return;
             } else {
                 let cmd = cc.commands.get(command);
                 if (!cmd.onPermCheck) await cmd.onRun(cc.client, msg, args, cc.options.vars[0], cc.options.vars[1]);
                 else if (!await cmd.onPermCheck(cc.client, msg, args, cc.options.vars[0], cc.options.vars[1])) {
                     if (!cmd.onNoPerm) await cmd.onError(cc.client, msg, args, cc.options.vars[0], cc.options.vars[1]);
                     else await cmd.onNoPerm(cc.client, msg, args, cc.options.vars[0], cc.options.vars[1]);
                 }
                 else await cmd.onRun(cc.client, msg, args, cc.options.vars[0], cc.options.vars[1]);
                 return;
             }
         } catch (e) {
             console.log(`[COMMAND-HANDLER]: Command ${command} ran into the error: ${e}`);
             let cmd = cc.commands.get(command);
             if (!cmd.onError) {
                 msg.channel.send('An error occurred when peforming this command.');
             } else cmd.onError(cc.client, msg, args, cc.options.vars[0], cc.options.vars[1]);
         }
     }

}
module.exports = CommandHandler;