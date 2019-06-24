const fs = require('fs');
let f = __dirname + '/../../../../configuration/blacklisted.json';
let blacklist = require(f);
let writeFile = require('util').promisify(fs.writeFile);

module.exports = (id, type=2, mod, reason="none") => {
    function onBlacklist(id) {
        let ids = Object.keys(blacklist);
        if (ids.includes(id)) return true;
        else return false;
    }

    function updateBlacklist() {
        blacklist = undefined;
        delete require.cache[require.resolve(f)];
        blacklist = require(f);
    }

    // add
    if (type == 0) {
        if (onBlacklist(id)) {
            return blacklist[id];
        }

        blacklist[id] = {
            time: new Date(),
            admin: mod,
            reason: reason 
        }
        try {
            writeFile(f, JSON.stringify(blacklist, null, 2));
            updateBlacklist();
            return blacklist[id];
        } catch (e) {
            return e;
        } 
    } else if (type == 1) { // remove
        if (!onBlacklist(id)) {
            return false;
        }

        delete blacklist[id];

        try {
            writeFile(f, JSON.stringify(blacklist, null, 2));
            updateBlacklist();
            return true
        } catch (e) {
            return e;
        }
    } else if (type == 2) { // check 
        if (!blacklist[id]) return false;
        else return true;
    } else if (type == 3) { // fetch
        if (!blacklist[id]) return false;
        else return blacklist[id];
    } else { // fetch all
        return blacklist;
    }
}