exports.setup = {
'name' : 'serverinfo',
'aliases' : [''],
'usage' : 'serverinfo',
'details' : 'Provides information on a server.',
'permission' : 0,
'permissionTxt' : 'Everyone',
'antiTheft': false,
'enabled' : true,
'reason' : 'updates'
}
exports.run = async (client, message, args, assistant) => {
/* start */

  let Discord = require("discord.js");
  let Guild = message.channel.guild.id;
  let member = this.guild ? this.guild.member(this.author) || null : null;
  let ServerName = message.channel.guild.name;
  let ServerIcon = message.channel.guild.iconURL;
  let Memcount = message.guild.members.size;
  let Rolec = message.guild.roles.size;
  let channelsss = message.guild.channels.size;
  let textc =  message.guild.channels.filter(c => c.type == "text").size;
  let vc =  message.guild.channels.filter(c => c.type == "voice").size;
  let category =  message.guild.channels.filter(c => c.type == "category").size;
  let bots = message.guild.members.filter(m=> m.user.bot === true).size;
  let region = message.guild.region;
  let ownerID = message.guild.ownerID;
  let ownerName = message.guild.owner.user.tag;
  let DATE = message.guild.createdAt;
  let prefix = message.guild.prefix;
  let banamnt = "To show this data, add \"View audit log\" to my permissions";
  if(message.guild.members.get(client.user.id).hasPermission("VIEW_AUDIT_LOG") == true) await message.guild.fetchBans().then(bans => {banamnt = bans.map(b => b).length;});
  let cc = (client.servers.get(message.guild.id).customcmd) ? Object.keys(client.servers.get(message.guild.id).customcmd).length : '0';
  let bc = (client.servers.get(message.guild.id).betaGuild) ? client.servers.get(message.guild.id).betaGuild : "No";

  let em = new Discord.RichEmbed();
  em.setColor('#42f4ee'); //message.member.displayHexColor
  em.setAuthor(ServerName, ServerIcon);
  em.setThumbnail(ServerIcon);
  em.setTimestamp(DATE);
  em.setFooter(`Created on:`, ServerIcon);
  em.setTitle("Server Information");
  em.addField("Server Name", ServerName, true);
  em.addField("Server ID", Guild, true);
  em.addField("Owner Name", ownerName, true);
  em.addField("Owner ID", ownerID, true);
  em.addField("Prefix", prefix, true);
  em.addField('Custom Commands', cc, true);
  em.addField('Beta Guild', bc, true);
  em.addField("Roles", Rolec, true);
  em.addField("Region", region, true);
  em.addField("Bans", banamnt, true);
  em.addField("Members", `**Total:** ${Memcount}\n**Bots:** ${bots}\n **Humans:** ${Memcount - bots}`, true);
  em.addField("Channels", `**Total:** ${channelsss}\n**Text:** ${textc}\n**Voice:** ${vc}\n**Category**: ${category}`, true);
//require('./serverprefixes.json');
//  let modrole = require('./serversettings.json')[`${message.guild.id}`].modrole
//  let modlog = require('./serversettings.json')[`${message.guild.id}`].modlog
  message.channel.send(em)
	/*  message.channel.send({ embed: {
		  color: 15158332,
		  author: {
          name: ServerName,
          icon_url: ServerIcon
		  },
		  title: "Server Information:",
		  thumbnail: {
			  url: ServerIcon
		  },
		  footer: {
			  icon_url: ServerIcon,
			  text: ("Created on: " + DATE)
		  },
		  fields: [{
			  name: "ID",
			  value: Guild,
			  inline: true
		  },
		  {
			  name: "Server Name",
			  value: ServerName,
			  inline: true
		  },
      {
        name: "Prefix",
        value: prefix,
        inline: true
      },
      {
        name: "ModRole",
        value: modrole,
        inline: true
      },
		  {
			  name: "Members",
			  value: Memcount,
			  inline: true
		  },
      {
        name: "Humans",
        value: (Memcount - bots),
        inline: true
      },
      {
			  name: "Bots",
			  value: bots,
			  inline: true
		  },
		  {
			 name: "Roles",
             value: Rolec,
             inline: true
		  },
		  {
			  name: "Channels",
			  value: channelsss,
			  inline: true
		  },
		  {
			  name: "Region",
			  value: region,
			  inline: true
		  },
		  {
			  name: "OwnerID",
			  value: ownerID,
			  inline: true
		  },
      {
        name: "Owner Tag",
        value: ownerName,
        inline: true
      }


	  ]}

  })*/

 /* finish */

}
