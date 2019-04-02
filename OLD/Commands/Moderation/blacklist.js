exports.setup = {
    'name' : 'blacklist',
    'aliases' : [],
    'usage' : 'Nothing shown here.',
    'details' : 'Nothing shown here.',
    'permission' : 6,
    'permissionTxt' : 'Developer',
    'antiTheft': false,
    'enabled' : true,
    'reason' : 'disabled'
    }
    const banned = [];
    exports.run = async (client, message, args, assistant) => {
        if(!args[0]) return message.channel.send(`${assistant.emoji.redtick} Provide a user.`);
        let user = args[0].replace(/[<,>,@,!]/ig, "");
        let reason = (!args[1]) ? "No reason provided." : args.slice(1, args.length).join(' ');
        if(!parseInt(user)) return message.channel.send(`${assistant.emoji.redtick} Provide a user mention.`);
        client.blacklisted = new Map();
        let d = assistant.database.readasync('blacklisted');
        Object.keys(d).forEach(u => {
          data = d[u];
          client.blacklisted.set(u, data)
        })
        try {
            await assistant.database.write('blacklisted', {parent : user, main: {parent: user, main: {reason: reason, banby: message.author}}});
            return message.channel.send(`${assistant.emoji.check} <@${user}> was blacklisted for: **${reason}**`);
          } catch (err) {
            return message.channel.send(`${assistant.emoji.redtick} **Error:** An internal error occured. Try joining the support server.\nMore information: \`\`\`xl${err}\`\`\``)
          }
    }
    