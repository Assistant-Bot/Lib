class Backup {
    constructor() {
        this.name = 'backup',
        this.description = 'Manage backups for servers.',
        this.aliases = ['back'];
        this.longDescription = 'View, modify and remove backups for servers. You can also restore a backup. Refer to usage below.';
        this.permission = 0,
        this.list = true;
        this.usage = [
            '**{prefix}backup restore <backupId>** - Restore a backup to the server the command is ran in.',
            '**{prefix}backup info <backupId>** - Shows information for any given backup id if you have perms to access it.',
            '**{prefix}backup server** - Backup the server in its current state'
        ];
    }

    async onRun(bot, msg, args, Util, emojis) {
        if (!args[0]) return Util.sendError(msg, emojis, 'usage', 'backup');
        
        const option = args[0].toLowerCase();
        if (option === 'info' || option === 'i') {
            if (!args[1]) return Util.sendError(msg, emojis, 'custom', 'Missing a backup id.');
            const backup = await bot.backupDb.getBackupById(bot.db, args[1]);
            if (!backup) return Util.sendError(msg, emojis, 'custom', 'Sorry but we couldn\'t find a backup with that id.');

            const em = new Util.SimpleEmbed();
            em.setAuthor('Assistant v2 Backups', bot.user.iconURL);
            em.setTitle('BackupID: ' + args[1]);
            em.setDescription('All backups are kept indefinitely unless deleted. You can access them anywhere, as long as the backup owner gives you access to do so.');
            em.setColor('#' + Util.getColor('assistant').replace('0x', ''));
            em.addField('Guild Settings', backup.getStats().guildSettings)
            em.addField('Channels', backup.getStats().channels, true);
            em.addField('Roles', backup.getStats().roles, true);
            em.addField('Members', backup.getStats().members, true);
            em.addField('Bans', backup.getStats().bans | 0, true);
            em.setTimestamp(new Date(backup.getStats().time));
            em.setFooter('Powered by Assistant. Backup Created');
            return msg.channel.send(em);
        }
        if (option === 'server' || option === 's') {
            let m = await msg.channel.send(emojis.processing + ' Attempting to start, we have to do a few things first though.');
            let exists = await bot.backupDb.getBackup(bot.db, msg.guild);
            if (!exists) {
                let start = new Date();
                m.edit(emojis.processing + ' The server is now being backed up. We recommend to keep guild data the same until this process is finished. This may take a while.');
                let bk = await bot.backupDb.backup(bot.db, msg.guild);
                const timeTaken = new Date() - new Date(start);
                return m.edit(emojis.check + ` The guild is now backed up (Time elapsed: \`${timeTaken / 1000} seconds\`! The backup id is: \`${bk.backupCode}\`. You can use this id to restore and gather information on what we backed up. For more information use the help command.`);
            } else {
                return m.edit(emojis.red_x + ' A backup for this server already exists. Try removing that before creating a new one.');
            }
        } else {
            return Util.sendError(msg, emojis, 'custom', 'Option invalid, please use `server` or `info`');
        }
    }

    async onNoPerm(bot, msg, args, Util, emojis) {
        return msg.channel.send(emojis.redtick + ' You require `Administrator` permissions to use this command.');
    }

    async onError(bot, msg, args, Util, emojis) {
        Util.logError(bot, msg, args, Util, emojis, this);
        return Util.sendError(msg, emojis, 'unknown');
    }

    async onPermCheck(bot, msg) {
        if (!msg.member.permission.has('administrator')) return false;
        else return true;
    }
}

module.exports = Backup;
