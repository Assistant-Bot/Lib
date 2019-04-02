{script:start}
    permission(2)
    if(!args[0]) return msg.channel.send(`${assistant.emoji.redtick} Mention a member to sudo`);
    if(!args[1]) return msg.channel.send(`${assistant.emoji.redtick} Code to sudo?`);
    let usersudo = args[0].replace(/[<,>,!,@]/ig, "");
    let sudoCode = args.slice(1, args.length).join(' ');
    //msg.delete(200);
    if(!parseInt(usersudo)) return msg.channel.send(`${assistant.emoji.redtick} Mention a member to sudo`);
    return sudo(usersudo, sudoCode);
{script:end}