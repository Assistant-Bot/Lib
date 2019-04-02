exports.setup = {
    'name' : 'restart',
    'aliases' : ['r'],
    'usage' : 'Nothing shown here.',
    'details' : 'Nothing shown here.',
    'permission' : 6,
    'permissionTxt' : 'Developer',
    'antiTheft': false,
    'enabled' : true,
    'reason' : 'disabled'
    }
    const banned = [];
    exports.run = async (client, message, args, assistant) => {
        let m = await message.channel.send('<a:loading:482672814583971850> Restarting bot in: 10 seconds.');
        let i = 8;
        let x = setInterval(async () => {
         if(i == 0) {
           clearInterval(x);
           await m.edit(`${bot.emoji.loading} Initiating restart.`);
           process.exit();
         }
         await m.edit(`<a:loading:482672814583971850> Restarting bot in: ${i} seconds.`);
         i = i - 2;
        }, 2000)
    }