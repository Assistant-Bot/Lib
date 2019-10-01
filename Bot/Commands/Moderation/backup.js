class Backup {
    constructor() {
        this.name = 'backup',
        this.description = 'Manage backups for servers.',
        this.aliases = ['back'];
        this.longDescription = 'View, modify and remove backups for servers. You can also restore a backup. Refer to usage below.';
        this.permission = 0,
        this.list = true;
        this.usage = [
            '**{prefix}backup server** - Backup the server in its current state',
            '**{prefix}backup info <backupId>** - Shows information for any given backup id if you have perms to access it.',
            '**{prefix}backup delete <backupID>** - Remove a backup from the database (Must be ran in server at which backup was created)',
            '**{prefix}backup restore <backupId>** - Restore a backup to the server the command is ran in.'
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
            em.setThumbnail(backup.getStats().iconURL);
            em.setTimestamp(new Date(backup.getStats().time));
            em.setFooter('Powered by Assistant. Backup Created');
            return msg.channel.send(em);
        }
        if (option === 'server' || option === 's' || option === 'save') {
            let m = await msg.channel.send(emojis.processing + ' Attempting to start, we have to do a few things first though.');
            let exists = await bot.backupDb.getBackup(bot.db, msg.guild);
            if (!exists) {
                let start = new Date();
                m.edit(emojis.processing + ' The server is now being backed up. We recommend to keep guild data the same until this process is finished. This may take a while.');
                let bk = await bot.backupDb.backup(bot.db, msg.guild);
                const timeTaken = new Date() - new Date(start);
                return m.edit(emojis.check + ` The guild is now backed up with the BackupID of **${bk.backupCode}**. You can use this id to restore and gather information on what we backed up. For more information use the help command. Time Elapsed: **${timeTaken / 1000}** seconds`);
            } else {
                return m.edit(emojis.red_x + ' A backup for this server already exists with the  BackupID: **' + exists.guild.backupID + '**');
            }
        } 
        if (option === 'delete' || option === 'd' || option === 'del') {
            if (!args[1]) return Util.sendError(msg, emojis, 'custom', 'Missing a backup id.');
            const backup = await bot.backupDb.getBackupById(bot.db, args[1]);
            if (!backup) return Util.sendError(msg, emojis, 'custom', 'Sorry but we couldn\'t find a backup with that id.');
            if (backup.guild.guildID !== msg.guild.id) return Util.sendError(msg, emojis, 'custom', 'You can not delete backups that are not owned by this server.');
            let m = await msg.channel.send(emojis.processing + ' Verifying indexes...');
            let start = new Date();
            m.edit(emojis.processing + ' Deleting backup: **' + args[1] + '**');
            await bot.backupDb.deleteBackup(bot.db, args[1]);
            const timeTaken = new Date() - new Date(start);
            return m.edit(emojis.check + ` Successfully deleted the backup with the id: **${args[1]}** in **${timeTaken / 1000}** seconds. We recommend you backup your server daily to help prevent nuking.`);
        }
        if (option === 'restore') { 
            if (!args[1]) return Util.sendError(msg, emojis, 'custom', 'Missing a backup id.');
            const backup = await bot.backupDb.getBackupById(bot.db, args[1]);
            if (!backup) return Util.sendError(msg, emojis, 'custom', 'Sorry but we couldn\'t find a backup with that id.');
            let m = await msg.channel.send(emojis.processing + ' Verifying indexes...');
            let start = new Date();
            m.edit(emojis.processing + ' Restoring backup: **' + args[1] + '**. This may take a while. This channel will not be deleted in the process.');
            await bot.backupDb.restore(bot, backup, msg.guild, m.channel.id);
            const timeTaken = new Date() - new Date(start);
            return m.edit(emojis.check + ` Successfully restored the backup with the id: **${args[1]}** in **${timeTaken / 1000}** seconds. Please be patient as discord may be still applying our changes.`);
        } else {
            return Util.sendError(msg, emojis, 'custom', 'Option invalid, please use `server`, `info` or `delete`');
        }
    }

    async onNoPerm(bot, msg, args, Util, emojis) {
        return msg.channel.send(emojis.redtick + ' You require `Administrator` permissions to use this command.');
    }

    async onError(bot, msg, args, Util, emojis) {
        Util.logError(bot, msg, args, Util, emojis, this);
        return Util.sendError(msg, emojis, 'custom', 'If this error persists please join the support server for help.');
    }

    async onPermCheck(bot, msg) {
        if (!msg.member.permission.has('administrator')) return false;
        else return true;
    }
}

module.exports = Backup;
