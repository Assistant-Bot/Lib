const Util = require('../../libraries/Assistant/main.js');
const CommandPermission = Util.CommandHandler.Permission;
const Owners = ['217006264570347520'];
module.exports = new CommandPermission('Owner', 10, (msg) => {
     return Owners.includes(msg.author.id);
});