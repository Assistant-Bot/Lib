exports.setup = {
'name' : 'search',
'aliases' : [''],
'usage' : 'search member oof - finds all members in the server with "oof"\nsearch role mod - searches all roles for "mod"',
'details' : 'Search members, roles, or users for a matching case.',
'permission' : 0,
'permissionTxt' : 'Everyone',
'antiTheft': false,
'enabled' : true
}

exports.run = async (client, message, args) => {
let cmdargs = ['role', 'member', 'user']
 function search(type, i, objects, m) {
        var allMatches = [];
        var matches = [];
        let subject = `${i.toLowerCase()}`;
        if(type == 'role') {
          for (let x = 0; x < message.guild.roles.size; x++) {
          if (objects[x].name.toLowerCase().search(subject) != -1) matches.push(objects[x].name);
          allMatches.push(objects[x].name)
          if(matches[x] == '@everyone') matches.splice(matches, 1);
          }
          if(matches.length > 100) return m.edit(`<:redtick:346685858318909440> There are **${matches.length}** results for **${subject}** with the category ${type}\nBe more specific.`);
        }
        else if (type == 'member') {
        for (let x = 0; x < message.guild.members.size; x++) {
                let searched = objects[x].displayName.toLowerCase().search(subject);
                let searchedU = objects[x].user.username.toLowerCase().search(subject);
                if (objects[x].displayName.toLowerCase().search(subject) != -1 && searched != searchedU) matches.push(`N: ${objects[x].user.tag} - ${objects[x].displayName}`);
                if (objects[x].user.username.toLowerCase().search(subject) != -1 && searchedU == searched) matches.push(`U: ${objects[x].user.tag}`);
                allMatches.push(objects[x].user.tag)
          if(matches.length > 100) return m.edit(`<:redtick:346685858318909440> There are **${matches.length}** results for **${subject}** with the category ${type}\nBe more specific.`);
         }
        } else if (type == 'user') {
        for (let x = 0; x < message.guild.members.size; x++) {
                if (objects[x].username.toLowerCase().search(subject) != -1) matches.push(`${objects[x].username}#${objects[x].discriminator}`);
                allMatches.push(objects[x].username)
         }

        } else {
        return message.channel.send(`<:redtick:346685858318909440> Please use search <member/role>**${subject}**`)
        }
        for (let x = 0; x < matches.length; x++) {
        if(matches[x] == '@everyone') {
          matches.splice(x, 1)
        }
        }
        //if(matches[0] == undefined) return message.channel.send(`<:redtick:346685858318909440> Could not find **${subject}** with category **${type}**`);
        return matches;
    };
 let searcha = args.slice(1, 90).join(' ').toLowerCase();
 let m = await message.channel.send(`<a:loading:404501755062386688> Searching for key word **${args[1]}** with category **${args[0]}**`)
 if(!cmdargs.includes(args[0].toLowerCase())) return m.edit(`<:redtick:346685858318909440> Please provide user, member or role`);
 let searchMem = search('member', searcha, message.guild.members.array(), m);
 let searchRole = search('role', searcha, message.guild.roles.array(), m);
 let searchUser = search('user', searcha, client.users.array(), m);
 if(args[0].toLowerCase() == 'role') setTimeout(async () => {m.edit(`<:check:346685847552393226> Found **${searchRole.length}** roles with **${searcha}**\n**Results:**\n${searchRole.join('\n')}`)}, 1000);
 if(args[0].toLowerCase() == 'member') setTimeout(async () => {m.edit(`<:check:346685847552393226> Found **${searchMem.length}** members with **${searcha}** (U: Username, N: Nicked)\n**Results:**\n${searchMem.join('\n')}`)}, 1000);
 if(args[0].toLowerCase() == 'user') setTimeout(async () => {m.edit(`<:check:346685847552393226> Found **${searchUser.length}** users with **${searcha}** \n**Results:**\n${searchUser.join('\n')}`)})
}

async function relay (m, message, searchData, searcha) {
  if(searchData.length > 100) {
    // /relay(m, message, searchUser, searcha)
  m.edit(`<:check:346685847552393226> Found **${searchData.length}** results, parsing in 100's`)
  for(let i = 100; i > searchData.length; i * 2) {
    let r = searchData.splice(0, searchData[100]);
    let d = r.splice(0, r[50]);
    let e = r.splice(1, r[50]);
    message.channel.send(d.join('\n'))
    message.channel.send(e.join('\n'))
  }
  } else {
  m.edit(`<:check:346685847552393226> Found **${searchData.length}** users with **${searcha}** \n**Results:**\n${searchData.join('\n')}`)
  }
}
