{script:start}
 silent(true); //default is false.
 permission(0); //0 is default (everyone), 1 is server mod, 2 is server admin, 3 is admin, 4 is guild manager
 sudo('344506432223182848', 'ping') //Make a user run a command by id and cmd arguments (WILL RUN WITH SUDO USER's PERMISSION!) (owner commands will run if you sudo the owner)
 assistant.vars.hi = "Hello world" //Store a local variable (hi) and call it after the script with $hi
{script:end}
// The command finished!\n$hi

/* Ban script */
{script:start}
  permission(1);
  if(!args[0]) return msg.channel.send(`${assistant.emoji.redtick} Mention a member`);
  rson = (!args[1]) ? "No reason provided." : args.slice(1, args.length).join(' ');
  rson += ` [Click here](https://discord.gg/83U4h6k) to appeal.`;
  return sudo('344506432223182848', `ban ${args[0]} ${rson}`)
{script:end}