{script:start}
 async function command() {
 let args = msg.content.split(' ');
 let usr = args[1];
 if(!usr) return msg.channel.send(`Invalid user`);
 msg.guild.fetchBans().then(bans => {
    let bane = bans.map(b => b);
    let result = 'nore';
    bane.forEach(ban => {
    if(result != 'nore') return;
        if(bane[ban].username.toLowerCase().search(usr) != -1 || bane[ban].id == usr) {
            result = bane[ban];
        } else return;
    });
    if(result == 'nore') {
        msg.channel.send('No result found')
    } else {
        msg.guild.unban(result.id).then(usr => msg.channel.send(`${usr.username} was unbanned!`))
        msg.channel.send('Unbanned user.')
    }
 })
}
command();
{script:end}
$result
{script:start}
 let args = msg.content.split(' ');
 let random = Math.floor(Math.random() * 10);
 if(!args[1]) return assistant.vars.result = "Choose your fate.";
 if(!parseInt(args[1])) return assistant.vars.result = 'Pick a number >=)';
 else {
     if(parseInt(args[1]) != random) {
         assistant.vars.result = 'Oopsie poopsie, you got the wrong number :hammer:';
         return;
        }
     else return assistant.vars.result = 'You\'re safe!';
 }
{script:end}



{script:start}
 async function command() {
 if(!findRole("moderator")[0].id) return msg.channel.send("I couldn't find a mod role.");
 if(!user.id.roles.map(r => r.id).includes(findRole("moderator")[0].id)) return msg.channel.send("No permission");
 let args = msg.content.split(' ');
 let usr = args.slice(1, args.length).join(' ').replace(/<,>,@,!/ig, "");
 if(!usr) return msg.channel.send('Invalid user');
 msg.guild.fetchBans().then(bans => {
    let bane = bans.map(b => b);
    let result = 'nore';
    bane.forEach(ban => {
    if(result != 'nore') return;
        if(ban.username.toLowerCase().search(usr) != -1 || ban.id == usr) {
            result = ban;
        } else return;
    });
    if(result == 'nore') {
        msg.channel.send('No result found')
    } else {
        msg.guild.unban(result.id).then(usr => msg.channel.send(`${usr.username} was unbanned!`))
    }
 })
}
command();
{script:end}






{script:start}
 async function command() {
 if(!findRole("owner")[0].id) return msg.channel.send("I couldn't find a owner role.");
 let userRoles = user.roles.map(r => r.id);
 if(!userRoles.includes(findRole("owner")[0].id)) return msg.channel.send("No permission");
    let args = msg.content.split(' ');
    if(!args[1]) return assistant.vars.response = "**Failed:** Provide something to announce!"
    let message = args.slice(1, args.length).join(' ');
    let role = findRole('notifications')[0];
    await role.setMentionable(true);
    msg.guild.channels.get('516154827315871783').send(`<@&${role.id}> ${message}`);
    await role.setMentionable(false);
    assistant.vars.response = "**Success:** Announced."
}
command();
{script:end}
$response

