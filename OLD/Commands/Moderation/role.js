exports.setup = {
'name' : 'role',
'aliases' : 'role @user role1, role2, role3 ++',
'details' : 'Add/Remove a user from roles. Roles and user can be searched by half spelling them.',
'permission' : 1,
'usage' : 'none set',
'antiTheft': true
}
exports.permissions = 2;
exports.run = async (client, message, args) => {

    function sendMessage(data) {
        message.channel.send(data)
    }

if (!message.guild.members.get(client.user.id).hasPermission('MANAGE_ROLES'))
  return sendMessage('<:redtick:346685858318909440> I can not apply changes to roles, make sure i have `Manage Roles`');

 function searchMem(objects) {
        var allMatches = [];
        var matches = [];
        let subject = args[0].toLowerCase();
        var regexp = new RegExp(subject, 'g');
        for (let x = 0; x < message.guild.members.size; x++) {
            let searched = objects[x].displayName.toLowerCase().search(subject);
            let searchedU = objects[x].user.username.toLowerCase().search(subject);
                if (objects[x].displayName.toLowerCase().search(subject) != -1 && searched != searchedU) matches.push(objects[x].displayName);
                if (objects[x].user.username.toLowerCase().search(subject) != -1 && searchedU == searched) matches.push(objects[x].user.username);
                allMatches.push(objects[x].user.username)
        }
        return matches;
    };
 function searchRol(i, objects) {
        var allMatches = [];
        var matches = [];
        let subject = `${i.toLowerCase()}`;
         console.log(`\n\n\nSUBJECT: ${subject}\nI VALUE: ${i}\n\n`)
        for (let x = 0; x < message.guild.roles.size; x++) {
                if (objects[x].name.toLowerCase().includes(subject)) matches.push(objects[x].name);
                allMatches.push(objects[x].name)
          console.log(`\n\nMATCHES: ${matches}`)
        }
        if(matches.length == 2) matches.splice(2, 1);
        if(matches[0] == undefined) return sendMessage(`<:redtick:346685858318909440> Could not find role **${subject}**`)
        return matches;
    };

    function userRole(role) {
        if (message.guild.roles.find('name', `${role}`)) {
            return role = message.guild.roles.find('name', `${role}`);
        } else {
            return false;
        }
    }
    let updatedRoles = []
    let user = '';

    if (!isNaN(args[0])) {
      user = args[0]
    } else {
      if(message.content.search('<@') != -1) {
        user = message.mentions.members.first().id
      } else {
        let user2 = searchMem(message.guild.members.array());
        if(user2.length > 1) return sendMessage(`<:redtick:346685858318909440> There are ${user2.length} results for the username, **${args[0]}**, be more specific`)
        if (!message.guild.members.find('displayName', `${user2[0]}`)) return sendMessage(`<:redtick:346685858318909440> The member, **${args[0]}** was not found.`);
        user = message.guild.members.find('displayName', `${user2[0]}`).user.id
      }
    }
    let guildMem = message.guild.members.get(user);
    let guildRoles = message.guild.roles;
    let x = args.slice(1, 9000).join(' ').split(", ");
    if(!guildMem) return sendMessage('<:redtick:346685858318909440> Member not found.')
    let roleserr = [];
    for (let i = 0; i < x.length; i++) {
        let roles = guildMem.roles
        let trole = x[i];
        if(!message.guild.roles.find('name', `${x[i]}`)) {
        trole = searchRol(x[i], message.guild.roles.array());
        if(trole.length > 1) {
          roleserr.push(trole.length)
          roleserr.push(x[i])
          return roleErr();
        }
        trole = trole[0];
        }
        if (roles.find('name', `${trole}`)) {
            updatedRoles.push(`- ${trole}`)
            guildMem.removeRole(userRole(trole)).catch(err => sendMessage(`The role **${trole}** does not exist. Or I my role isn't higher than the member.`) && updatedRoles.splice(i, 1))
        }

        if (!roles.find('name', `${trole}`)) {
            updatedRoles.push(`+ ${trole}`)
            guildMem.addRole(userRole(trole)).catch(err => sendMessage(`The role **${x[i]}** does not exist. Or I my role isn't higher than the member.`) && updatedRoles.splice(i, 1))
        }
    }
    sendMessage(`Updated: ${client.users.get(user).tag}\n\`\`\`diff\n${updatedRoles.join('\n')}\`\`\``);
    function roleErr() {
    sendMessage(`Updated: ${client.users.get(user).tag}\n\`\`\`diff\n${updatedRoles.join('\n')}\`\`\``);
    return sendMessage(`<:redtick:346685858318909440> There are ${roleserr[0]} results for **${roleserr[1]}** be more specific.`);
    }

}
