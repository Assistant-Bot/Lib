class help {
    constructor () {
        this.name = 'help';
        this.alias = ['h'];
        this.description = 'Help for commands.';
        this.longDescription = 'Show help for each command.';
        this.usage = '{p}help [command]';
    }

    async onRun(bot, msg, args) {
        if (bot.commandHandler) {
            this.handle(bot, msg, args, bot.commandHandler);
        }

        if (bot.commandhandler) {
            this.handle(bot, msg, args, bot.commandhandler);
        }

        return false;
    }

    async onError(bot, msg, args) {
        return;
    }

    async onNoPerm() {
        return;
    }

    async onPermCheck() {
        return true;
    }

    async handle(bot, msg, args, handler) {
        let parents = handler.commands.find((c, cmd) => { if (c !== cmd.name) return false; else return true;}).map(c => c[1]);
        let clean = [];

        let embed = {
            title : `${bot.user.username} Help - ${parents.length}`,
            color: handler.options.
        }
    }
}