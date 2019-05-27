class Options {
    constructor(prefix, token, cooldown, client) {
        if(!prefix) this.prefix = '!<'; // Default prefix.
        if(!token) this.token = null; // Token to the bot.
        if(!cooldown) this.cooldown = 3000; // 3 seconds.
        if(!client) this.client = false;

        return this;
    }

    /**
     * @param {String} prefix - Prefix for the bot, if this is custom pass a database.
     */
    setPrefix(prefix) {
        this.prefix = prefix;
        return this;
    }

    /**
     * @param {String} token - Token for bot | WARNING: WILL RESET CLIENT 
     */
    setToken(token) {
        this.token = token;
        return this;
    }

    /**
     * @param {Number} time - Time until another command can be used.
     */
    setCooldown(time, msg=null) {
        this.cooldown = time;
        this.cooldownMsg = msg;
        return this;
    }

    /**
     * @param {Object|Boolean} client - Bot client, or false. 
     */
    setClient(client=false) {
        this.client = client;
        return this;
    }

    /**
     * @param {Optional} def 
     */
    setCaching(def=false) {
        this.caching = def;
        return this;
    }

    /**
     * @param {Array} arr - Array of options to pass through each command. 
     */
    setVars(arr) {
        this.vars = arr;
        return this;
    }

    /**
     * @param {Function} func 
     */
    setCustomHandler(func) {
        if(typeof func !== 'function') throw 'Must be a function';
        this.customHandler = func;
        return this;
    }

    loadSubfolders(bool=true) {
        this.loadFolders = true;
        return this;
    }
}

module.exports = Options;