/**
 * This class was inspired by AxonCore
 */
class Database {
    constructor () {
        this.guildSchema = require('./Schems/Guild');
        this.backupSchema = require('./Schems/GuildBackup');
        this.defaults = {
            prefix: 'a!'
        }

        this.createGuild = this.initGuild; // called by cmd handler
    }

    async getPrefix(id) {
        //if (id == '0') return this.defaults.prefix;
        let g = await this.fetchGuild(id);
        if (g == null) {
            this.initGuild(id);
            return this.defaults.prefix;
        } else return  g.prefix;
    }

    getGuild(gID) {
        return this.guildSchema.findOne({
            guildID: gID,
        }).exec(); //.lean();
    }

    fetchGuild(gID) {
        return this.guildSchema.findOne({
            guildID: gID,
        }).exec();
    }

    /**
     * @param {String} gID - guild ID
     * @returns {Promise<Object|null>} Guild Schema Object newly created
     * @memberof MongoService
     */

    initGuild(gID) {
        return this.guildSchema.findOneAndUpdate({
            guildID: gID,
        }, {
            guildID: gID,
            prefix: 'a!',
        }, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        }).exec();
    }


    /**
     * Update the guild prefix for a server
     * 
     * @param {String} gID - Guild Id to update
     * @param {String} prefix - the prefix
     * @returns {Promise<Object|null>}
     */

    updatePrefix(gID, prefix) {
        return this.guildSchema.findOneAndUpdate({
            guildID: gID,
        }, {
            $set: {
                prefix: prefix,
            },
        }, {
            new: true,
            upsert: true,
        }).exec();
    }

    updateIgnoredChannels(gID, value) {
        return this.guildSchema.findOneAndUpdate({
            guildID: gID,
        }, {
            $set: {
                ignoredChannels: value,
            },
        }, {
            new: true,
            upsert: true,
        }).exec();
    }

    rawUpdate(gID, key, newValue) {
        let newIndex = {};
        newIndex[key] = newValue;
        return this.guildSchema.findOneAndUpdate({
            guildID: gID,
        }, {
            $set: newIndex,
        }, {
            new: true,
            upsert: true,
        }).exec();
    }

    saveBackup(gID, bk) {
        console.log(bk);
        return this.backupSchema.findOneAndUpdate({
            guildID: gID,
        }, {
            $set: bk,
        }, {
            new: true,
            upsert: true,
        }).exec();
    }

    getBackup(gID) {
        return this.backupSchema.findOne({
            guildID: gID,
        }).exec();
    }
}

module.exports = Database;