const Util = require('../utils/main');
class AntiRaid {
     constructor (bot) {
         this.bot = bot;
         this.triggered = new Util.AdvancedMap();
         this.possible = new Util.AdvancedMap();
         this.default = {
             triggers: 0, // COUNT
             suspected: [], // ARRAY
             timeRestraint: 0, // MINUTES
             leniency: null, // HOW LENIENT SHOULD ASSISTANT BE BEFORE TRIGGERING?
             time_issued: null // TIME RAID WARNING WAS TRIGGERED
         }
         return this;
     }

     initialize() {
        this.bot.on('message', this.messageEvent);
        this.bot.on('guildMemberAdd', this.memberJoin);
        this.bot.on('guildMemberRemove', this.memberLeave);
        return this;
     }

     async messageEvent(msg) { /** ... TO DO .... */}
     async memberJoin(m) { /** ... TO DO .... */ }
     async memberLeave(m) { /** ... TO DO .... */ }

     scan(guild, member) {
        if (!this.possible.has(guild.id)) {
            this.possible.set(guild.id, this.default);
            return false;
            // No reason to trigger anti-raid, guild not setup.
        }
        
        let stored = this.possible.get(guild.id);
        if (stored.triggers > 5) {
            stored.time_issued = new Date();
            if (!this.triggered.has(guild.id)) this.triggered.set(guild.id, stored);
            else {
                this.triggered.triggers++;
                if (this.triggered.triggers >= this.bot.database.getRaidSettings(guild.id).until) {
                    this.bot.lockDown(guild.id, 'Raid Detected');
                    return true;
                }
                return true;
            }
        }

        else return false;
     }
}

module.exports = AntiRaid;