{script:start}
    permission(2)
    if(!args[0]) return msg.channel.send(`${assistant.emoji.redtick} Mention a member`);
    rson = (!args[1]) ? "No reason provided." : args.slice(1, args.length).join(' ');
    rson += `\n**Details:** You're appeal was denied and you have been suspended from appealing.`;
    return sudo('344506432223182848', `ban ${args[0]} ${rson}`)
{script:end}