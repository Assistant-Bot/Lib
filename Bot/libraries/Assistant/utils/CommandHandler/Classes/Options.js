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
    setCooldown(time) {
        this.cooldown = time;
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
}