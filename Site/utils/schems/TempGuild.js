const Permissions = require('./permissions');
class TempGuild {
    constructor(guild) {
        if(guild.icon === null) this.icon = 'https://banner2.kisspng.com/20171216/0a6/question-mark-png-5a352b58b02c08.4921308315134339447216.jpg';
        else this.icon = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`;
        this.id = guild.id;
        this.isOwner = guild.owner;
        this.name = guild.name;
        this.permissions = new Permissions(guild.permissions);
    }

    hasPermission(flag) {
       return this.permissions.has(this.permissions.constructor.FLAGS[flag]);
    }
}
module.exports = TempGuild;