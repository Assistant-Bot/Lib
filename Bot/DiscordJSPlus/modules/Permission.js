require('discord.js');
class Permission {
    constructor(check) {
        this.check = check;
        if((this.check instanceof Function) == false) this.check = (f) => {return true};
    } 

    run(msg) {
        return this.check(msg);
    }
}

module.exports = Permission;