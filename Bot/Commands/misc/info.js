class info {
    constructor() {
        this.name = 'info'; // Name of the command AKA normal name of cmd.
        this.description = '/info'; // Short description on how the command is used.
        this.aliases = []; // Aliases! What other names should this command run on?
        this.longDescription = 'Provide information on Assisant.'; // Long description of the command.
        this.permission = 0; // Permissions to use the command (Optional, you can refer to other methods by refferring to documentation)
        this.list = true; // Should we list the command in the help menu
        this.cooldown = 0; // Seconds
    }

    async onRun(bot, msg, args, Util, emojis) {
        /*
        let permission = Util.checkClientPermission(bot, msg, 'embedLinks');
        if (!permission) {
            return Util.sendError(msg, emojis, 'perm', 'embed_links');
        }*/

    }

    async onError(bot, msg, args, Util, emojis) {
        Util.logError(bot, msg, args, Util, emojis, this);
        return Util.sendError(msg, emojis, 'unknown');
    }
}

module.exports = info;