class Options {
    constructor(prefix, token, cooldown) {
        if(!prefix) this.prefix = '!<'; // Default prefix.
        if(!token) this.token = null; // Token to the bot.
        if(!cooldown) this.cooldown = 3000; // 3 seconds.
    }

    /**
     * @param {String} prefix - Prefix for the bot, if this is custom pass a database.
     */
    setPrefix(prefix) {
        this.prefix = prefix;
    }

    /**
     * @param {String} token - Token for bot | WARNING: WILL RESET CLIENT 
     */
    setToken(token) {
        this.token = token;
    }

    /**
     * @param {Number} time - Time until another command can be used.
     */
    setCooldown(time) {
        this.cooldown = time;
    }
}