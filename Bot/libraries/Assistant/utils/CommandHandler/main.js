const options = require('./Classes/Options.js');
const CommandCollection = require('./Classes/CommandCollection');
const util = require('util');

class CommandHandler {
    commands = new CommandCollection();
    load = this.start;
    clientTypes = {
        0: 'Discord.JS',
        1: 'Eris'
    };

    /**
     * @param {String} dir 
     * @param {Options} options
     */
    constructor (dir, options) {
        if (!this.resolvable(dir)) throw 'Could not find directory: ' + dir;
        if (!options instanceof Options) throw 'Invalid options';
        if (!options.token && options.client === false) throw 'You must provide a token if you don\'t pass a client'; 
        if (options.client == false) {
            this.client = new Discord.Client(options.token);
            this.clientType = 0;
        } else this.detectClient(options.client);
        if (!options.prefix) throw 'Invalid prefix';
        if (typeof options !== 'string') this.database = options.prefix;
        this.options = options;
    }

    /**
     * @returns {Boolean|Array}
     */
    reloadCommands(resetClient=false, client=this.client) {
        if (!this.loaded) throw 'Commands have not been loaded yet, this may have been a failure.';
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
        if (!typeof client === 'function') throw 'Invalid client';
        if (client.eventNames == undefined || client.eventNames !== 'functions') throw 'Invalid client';
        if (!typeof client.eventNames == 'function') throw 'Client does not have a valid event listener';
        let events = client.eventNames();
        if (events.includes('messageCreate')) this.clientType = 1;
        else this.clientType = 0;
    }

    /**
     * @returns {VoidFunction} - Nothing.
     */
    async registerMessage() {
        if (util.inspect(this.client.listners('message')).length >= 1) this.client.removeListener('message');
        if (!this.loaded) this.loaded = true;
        else { this.loadCommands(); this.loaded = true };
        const listener = (this.clientTypes[this.clientType] == 'Eris') ? 'messageCreate' : 'message';
        this.client.on(listener, (m) => {
            /* Command shit here */
        }); 
    }

    /**
     * @returns {Client} - Returns a client
     */
    start() {
        await this.loadCommands();
        await this.registerMessage();
        return this.client;
    }

    /* Static */
    static commandOptions = options;
}

module.exports = CommandHandler;