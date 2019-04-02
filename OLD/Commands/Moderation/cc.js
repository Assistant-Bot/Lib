exports.setup = {
    'name' : 'customcommands',
    'aliases' : ['customcommand', 'cc'],
    'usage' : '`cc vars` - show custom command variables\n`cc add <name> <code>` - Add a custom command\n`cc remove <name>` - Remove a custom command.\n`cc test <code>` - Debug code for a custom command.\n`cc show <command>` - Show code for a custom command\n`cc list` - Show all custom commands on the server.\n`cc <remove> <cmdName>` (rm, del, and delete also work) remove a custom command.\n`cc modify <cmd> <newscript>` Modify a command.',
    'details' : 'Modify, test, add and remove custom commands!',
    'examples' : [''],
    'permission' : 0,
    'permissionTxt' : 'Everyone',
    'antiTheft': false,
    'enabled' : true,
    'reason' : 'Updates, This command will be updated soon.'
    }
const Discord = require('discord.js');
exports.run = async (client, message, args, assistant) => {
    let setting = (args[0] != undefined) ? args[0].toLowerCase() : false;
    if(setting == false) return message.channel.send(`${assistant.emoji.redtick} Provide a setting`);
    if(!message.guild.members.get(client.user.id).hasPermission("EMBED_LINKS")) return message.channel.send(`${assistant.emoji.redtick} **Error:** In order for this command to work, I need permission to embed links in this channel.`);
    
    if(setting == "vars") {

        let embed = new Discord.RichEmbed()
        embed.setColor(message.member.displayHexColor);
        embed.setAuthor(client.user.tag, client.user.displayAvatarURL);
        embed.addField("User Related", usrcc);
        embed.addField("Server Related", sercc);
        embed.addField("Bot variables", bcc);
        embed.setTimestamp(new Date('2018-11-29T03:22:26.726Z'));
        embed.setFooter("CC Variables as of");
        return message.channel.send(embed);

    } else if(setting == "test") {

        if(!args[1]) return message.channel.send(`${assistant.emoji.redtick} Please provide a script to test.`);
        let code = args.slice(1, args.length).join(' ');
        if(code.length > 300) return message.channel.send(`${assistant.emoji.redtick} Please use a script that is less than 300 chars.`);
        let embed = new Discord.RichEmbed()
        embed.setColor(message.member.displayHexColor);
        embed.setAuthor(client.user.tag, client.user.displayAvatarURL);
        embed.addField("Raw input", code);
        embed.addField("Filtered output", client.getVars(code, "cc", message))
        return message.channel.send(embed);

    } else if(setting == "add" || setting == "create") {
        if(!client.checkperms('admin')) return message.channel.send(`${assistant.emoji.redtick} You need **Administrator** to modify commands.`);
        let server = client.servers.get(message.guild.id);
        if(!server.customcmd) server.customcmd = {};
        let cmds = Object.keys(server.customcmd);
        let code = (args[2]) ? args.slice(2, args.length).join(' ') : false;
        let command = (args[1]) ? args[1].toLowerCase() : false;
        if(command == false) return message.channel.send(`${assistant.emoji.redtick} Please provide a name for the command.`);
        if(command.length > 20) return message.channel.send(`${assistant.emoji.redtick} Commands can not be larger than 20 characters.`)
        if(cmds.includes(command)) return message.channel.send(`${assistant.emoji.redtick} You already have a custom command with this name.`);
        if(client.commands.has(command)) return message.channel.send(`${assistant.emoji.redtick} You can not have a custom command with the same name as a bot command.`);
        if(code == false) return message.channel.send(`${assistant.emoji.redtick} Please provide a script to add to this command name.`);
        let m = await message.channel.send(`${assistant.emoji.square} Adding custom command: **${command}**`);
        try {
            server.customcmd[command] = code;
            await assistant.database.write('settings', {parent: message.guild.id, child: "customcmd", value: server.customcmd});
            client.servers.delete(message.guild.id);
            return m.edit(`${assistant.emoji.check} Added custom command: **${command}**`);
        } catch (err) {
            return m.edit(`${assistant.emoji.redtick} Failed to add custom command: **${command}**`);
        }

    } else if (setting == "edit" || setting == "modify") {
        if(!client.checkperms('admin')) return message.channel.send(`${assistant.emoji.redtick} You need **Administrator** to modify commands.`);
        let server = client.servers.get(message.guild.id);
        if(!server.customcmd) return message.channel.send(`${assistant.emoji.redtick} This server doesn't have any custom commands`);
        let cmds = Object.keys(server.customcmd);
        let command = (args[1]) ? args[1].toLowerCase() : false;
        let code = (args[2]) ? args.slice(2, args.length).join(' ') : false;
        if(command == false) return message.channel.send(`${assistant.emoji.redtick} Please provide a custom command to modify.`);
        if(!cmds.includes(command)) return message.channel.send(`${assistant.emoji.redtick} That command does not exist.`);
        if(code == false) return message.channel.send(`${assistant.emoji.redtick} Please provide a script to replace this command.`);
        let m = await message.channel.send(`${assistant.emoji.square} Modifying custom command: **${command}**`);
        try {
            server.customcmd[command] = code;
            await assistant.database.write('settings', {parent: message.guild.id, child: "customcmd", value: server.customcmd}, false);
            client.servers.delete(message.guild.id);
            return m.edit(`${assistant.emoji.check} Modified custom command: **${command}**`);
        } catch (err) {
            console.log(err)
            return m.edit(`${assistant.emoji.redtick} Failed to modify custom command: **${command}**`);
        }
    } else if(setting == "delete" || setting == "remove" || setting == "rm" || setting == "del") {
        if(!client.checkperms('admin')) return message.channel.send(`${assistant.emoji.redtick} You need **Administrator** to modify commands.`);
        let server = client.servers.get(message.guild.id);
        if(!server.customcmd) return message.channel.send(`${assistant.emoji.redtick} This server doesn't have any custom commands`);
        let cmds = Object.keys(server.customcmd);
        let command = (args[1]) ? args[1].toLowerCase() : false;
        if(command == false) return message.channel.send(`${assistant.emoji.redtick} Please provide a custom command.`);
        if(!cmds.includes(command)) return message.channel.send(`${assistant.emoji.redtick} That command does not exist.`);
        let m = await message.channel.send(`${assistant.emoji.square} Removing custom command: **${command}**`);
        try {
            delete server.customcmd[command];
            await assistant.database.write('settings', {parent: message.guild.id, child: "customcmd", value: server.customcmd}, false);
            client.servers.delete(message.guild.id);
            return m.edit(`${assistant.emoji.check} Removed custom command: **${command}**`);
        } catch (err) {
            console.log(err)
            return m.edit(`${assistant.emoji.redtick} Failed to remove custom command: **${command}**`);
        }

    } else if(setting == "list") {
        let server = client.servers.get(message.guild.id);
        if(!server.customcmd) return message.channel.send(`${assistant.emoji.redtick} This server doesn't have any custom commands`);
        let cmds = Object.keys(server.customcmd);
        if(cmds.length <= 0) return message.channel.send(`${assistant.emoji.redtick} This server doesn't have any custom commands`);
        let embed = new Discord.RichEmbed()
        embed.setColor(message.member.displayHexColor);
        embed.setAuthor(client.user.tag, client.user.displayAvatarURL);
        embed.addField(`${message.guild.name}'s custom commands:`, `\`\`\`${cmds.join(", ")}\`\`\``)
        return message.channel.send(embed);

    } else if(setting == "show") {
        if(!client.checkperms('admin')) return message.channel.send(`${assistant.emoji.redtick} You need **Administrator** to view command code.`);
        let server = client.servers.get(message.guild.id);
        if(!server.customcmd) return message.channel.send(`${assistant.emoji.redtick} This server doesn't have any custom commands`);
        let cmds = Object.keys(server.customcmd);
        let command = (args[1]) ? args[1].toLowerCase() : false;
        if(command == false) return message.channel.send(`${assistant.emoji.redtick} Please provide a custom command.`);
        if(!cmds.includes(command)) return message.channel.send(`${assistant.emoji.redtick} That command does not exist.`);
        let embed = new Discord.RichEmbed()
        embed.setColor(message.member.displayHexColor);
        embed.setAuthor(`Custom Command: ${command}`, client.user.displayAvatarURL);
        if(server.customcmd[command].length >= 992) {
            embed.addField("Raw Code", `\`\`\`js\n${server.customcmd[command].split('').slice(0, 992).join('')}... Limit exceeded.\`\`\``);
        }
        else embed.addField("Raw Code", `\`\`\`js\n${server.customcmd[command]}\`\`\``);
        return message.channel.send(embed);
    } else {
        return message.channel.send(`${assistant.emoji.redtick} Custom command attribute \`${setting}\` not found. Use \`${message.guild.prefix}help cc\` for more help.`);
    }

}



const usrcc = `**{user.name}**, **{member.username}** - Username of user running the command.
**{user}**, **{member}** - Mention of user.
**{user.id}** - Id of user.
**{user.tag}** - Tag of user.`;
const sercc = `**{server.name}** - Server name.
**{server.owner}** - Mention of server owner.
**{server.settings}** - An array of settings on the server. 
**{server.roles}** - List server roles by name.
**{server.members}** - Number of members on the server.
**{server.humans}** - Number of humans on the server.`;
const bcc = `**{cc}** - Number of custom commands on the server.
**{script:start} <script here> {script:end}** - Run a script when the command is called`;
 /* @ Custom command variables @ 
  ==USER==
  {user.name} {member.username} - Username of user.
  {user} {member} - mention of user.
  {user.id} - id of user.
  {user.tag} - tag of user.
  ==SERVER==
  {server.name} - Server name.
  {server.owner} - Mention of server owner.
  {server.settings} - An array of settings on the server. 
  {server.roles} - List server roles by name.
  {server.members} - Number of members on the server.
  {server.humans} - Number of humans on the server.
  ==BOT VARS==
  {cc} - Number of custom commands on the server.
  {cc.list} - list all custom commands on the server.
  {cc.delete=NAME} - Delete a custom command on the server.
  {cc.add=NAME;cc.code=CODE} - Add a custom command to the server.
  {warnings=USER} - Get the warnings for a user (PREMIUM).
  {!cmd} - Run an assistant command!
  $1, $2, $3
 */