class Options {
    constructor(prefix, token, cooldown, client) {
        if(!prefix) this.prefix = '!'; // Default prefix.
        if(!token) this.token = null; // Token to the bot.
        if(!cooldown) this.cooldown = 3000; // 3 seconds.
        if(!client) this.client = false;
        this.allowBots = false;
        this.storeCmd = true;
        this.blacklistFunction = (id) => {return false;}
        this.os = 1;
        this.caching = false;
        this.defaults = {
            helpMenu: {
                embed: true, // Embed all help messages?
                color: 0x26d1ff, // Color of embed mMLUL
                display: 'compact', // Cat - Commands VS command - info command - info command - info command - info
                perCommand: true, // allow usage of !help [command]?
                pager: false // OPTION NOT DONE YET PLS NO
            }
        };
        this.helpMenu = true;
        this.helpMenuOpts = this.defaults.helpMenu;
        return this;
    }

    /**
     * @param {Boolean} bool - Respond to unknown commands? if so, send the message.
     * @param {String} msg - Message to respond with
     * @description Defaults to false
     */
    unknownCommands(bool, msg=null) {
        this.resToUnk = bool
        this.resMsg = msg;
        return this;
    }

    /**
     * @param {Boolean} bool - Use built in help menu?
     */
    useHelpMenu(bool=true, opts) {
        this.helpMenu = true;
        this.helpMenuOpts = (!opts) ? this.defaults.helpMenu : opts;
        return this;
    }
    
    

    storeUnderclient(bool) {
        this.storeCmd = bool;
        return this;
    }

    /**
     * 
     * @param {Boolean} bool - Respond to bots?
     * @default false
     */

    setAllowBots(bool = true) {
        this.allowBots = bool;
        return this;
    }

    /**
     * @param {Number} system - Use 0 if windows is being picky, and 1 for linux/windows (this changes how the handler loads)
     * @default 1
     */
    
    setOS(system) {
        this.os = system;
        return this;
    }


    /**
     * @param {Function} func 
     */
    setBlacklist(func) {
        this.blacklistFunction = func;
        return this;
    }

    /**
     * @param {String} prefix - Prefix for the bot, if this is custom pass a database.
     * @description Prefix for the bot OR iterated class with a getPrefix(SERVER_ID):String method.
     */
    setPrefix(prefix) {
        this.prefix = prefix;
        return this;
    }

    /**
     * @param {String} token - Token for bot | WARNING: WILL RESET CLIENT 
     * @description - Token for the client. (ONLY USE IF YOU SET THE CLIENT INSTANCES TO TRUE)
     */
    setToken(token) {
        this.token = token;
        return this;
    }

    /**
     * @param {Number} time - Time until another command can be used.
     * @param {String} msg - Message to be sent when a user reaches the cooldown.
     * @description - Percommand cooldown takes priority over default cooldown.
     */
    setCooldown(time, msg=null) {
        this.cooldown = time;
        this.cooldownMsg = msg;
        return this;
    }

    /**
     * @param {Object|Boolean} client - Bot client, or false. 
     * @description Should the command handler make a new client instance?
     */
    setClient(client=false) {
        this.client = client;
        return this;
    }

    /**
     * @param {Optional} def - Cache commands on load? 
     * @description defaults to false to save memory
     */
    setCaching(def=false) {
        this.caching = def;
        return this;
    }

    /**
     * @param {Array} arr - Array of options to pass through each command. 
     * @description - 2 max, (Support for more later)
     */
    setVars(arr) {
        this.vars = arr;
        return this;
    }

    /**
     * @param {Function} func - Set a custom handler, this will handle the message event.
     */
    setCustomHandler(func) {
        if(typeof func !== 'function') throw 'Must be a function';
        this.customHandler = func;
        return this;
    }

    /**
     * @param {Boolean} bool - Log messages to console on load? 
     */
    logMessages(bool=false) {
        this.logMessages = bool;
        return this;
    }

    /**
     * @param {Boolean} bool - Load commands by types? 
     * @description EG: folder/moderation/command VS folder/command
     */
    loadSubfolders(bool=true) {
        this.loadFolders = bool;
        return this;
    }
}

module.exports = Options;