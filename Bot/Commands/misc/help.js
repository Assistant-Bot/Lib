class Help {
    constructor () {
        this.name = 'help';
        this.aliases = ['h'];
        this.description = 'Help for commands.';
        this.longDescription = 'Show help for each command.';
        this.usage = '{p}help [command]';
    }

    async onRun(bot, msg, args, Util, emojis) {
        
    }
}