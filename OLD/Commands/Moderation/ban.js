exports.setup = {
'name' : 'ban',
'aliases' : ['ban', 'b'],
'usage' : 'ban @Olybear9 being unbareable... - Bans @User for "being unbareable."',
'details' : 'Ban a user from the server.',
'permission' : 1,
'permissionTxt' : 'Server Moderator',
'antiTheft': false,
'enabled' : true
}
const Discord = require('discord.js');
exports.run = async function(client, message, args, assistant) {
 const server = client.servers.get(message.guild.id);
 if(message.guild.members.get(client.user.id).hasPermission('BAN_MEMBERS') == false) return message.channel.send(`${assistant.emoji.redtick} I need permission to ban members.`);
 if(server.appeals == undefined || server.appeals.enabled == false) {
	if(!args[0]) return message.channel.send(`${assistant.emoji.redtick} Provide a username, user id or mention to ban.`);
	let user = args[0].replace(/[@,>,<]/ig, "");
	let reason = (args[1] == undefined) ? "No reason provided." : args.slice(1, args.length).join(' ');
	if(!parseInt(user.replace('!', ""))) {
		//what to do when no id
		let members = message.guild.members.map(m => m);
		let results = [];
		await members.forEach(member => {
			if(member.user.username.toLowerCase().search(user.toLowerCase().replace("!", "")) != -1) {
				results.push(member.id);
			}
		})
		if(results.length == 0) return message.channel.send(`${assistant.emoji.redtick} No results, try using an id instead.`);
		if(results.length > 1) return message.channel.send(`${assistant.emoji.redtick} Be more percise, there are **${results.length}** results for that user.`);
		else user = results[0];
	} else {
		user = user.replace("!", "");
	}
	let m = await message.channel.send(`${assistant.emoji.square} Banning: **${user}**`);
	try {
		if(user == client.user.id) return m.edit(`${assistant.emoji.redtick} Use \`${message.guild.prefix}leave\` if you wish to kick me and remove this servers data in my database.`)
		if(client.users.get(user)) {
			let em = new Discord.RichEmbed();
			em.setColor('#ff0000');
			em.setAuthor(message.author.tag, message.author.displayAvatarURL);
			em.addField(`You were banned.`, `**Server Name:** ${message.guild.name}\n**Owner of server:** ${message.guild.owner.user.tag}\n**Appeal:** This server did not have appeals enabled.`);
			em.addField(`Details`, `**Permanent:** Yes\n**Moderator:** ${message.author.tag}`);
			em.addField('Reason', reason);
			em.setThumbnail(message.guild.iconURL);
			em.setTimestamp(new Date());
			em.setFooter(`Banned from: ${message.guild.name}`);
			await client.users.get(user).send(em);
		}
	} catch (error) {
		message.channel.send(`${assistant.emoji.warning} Could not dm user, reason message.`);
	}

	try {
	  await message.guild.ban(user, `Moderator: ${message.author.tag} Reason: ${reason}`);
	  return m.edit(`${assistant.emoji.check} Successfully Banned User!`);
	} catch (err) {
	  return m.edit(`${assistant.emoji.redtick} An error occurred when banning the user, try checking my role, making sure it's higher than the user you are trying to ban.`);
	}
 }
}
