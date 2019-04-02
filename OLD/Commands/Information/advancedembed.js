exports.setup = {
    'name' : 'advancedembed',
    'aliases' : ['adembed', 'aembed'],
    'usage' : 'advancedembed',
    'details' : 'Go through the advanced embed creator.',
    'permission' : 1,
    'permissionTxt' : 'Server Moderator',
    'antiTheft': false,
    'enabled' : false,
    'reason' : 'Exploit to restart bot detected'
    }
exports.run = async (client, msg, args, assistant) => {
const Discord = require('discord.js');
const embed = new Discord.RichEmbed()
        var step = 0
        var whatToDo = {
            0 : (content, msg) => {
                if(content != 'x' || content != 'X') {
                    embed.setTitle(content)
                }
                step++
                msg.channel.send("Now onto our description.")
            },
            1: (content, msg) => {
                embed.setDescription(content)
                step++
                msg.channel.send({embed})
            }
        }
        msg.channel.send("Initiating the embed creation process, you can send `close` to close at any time. You can also type an `x` to leave a field blank. Start off with responding with your title.")
        var collector = new Discord.MessageCollector(msg.channel, m => m.author.id == msg.author.id)
        collector.on('collect', msg => {
            if(msg.content.toLowerCase() == 'x') {
                return step++
            }
            if(msg.content.toLowerCase() == 'close') {
                msg.channel.send("Closing your session")
                return collector.stop('User ended session')
            }

            whatToDo[step](msg.content, msg)
        })
    }