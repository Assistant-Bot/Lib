class DataBase {
    constructor (dbName, port) {
        this.name = dbName;
        this.url = 'mongodb://localhost:' + port;
        this.mongoClient = require('mongodb').MongoClient;
    }

    /**
     * @param {String} collection - Collection name
     * @param {any} content - Content to insert
     * @param {Null|String} indentifier - Attach Identfier to content? 
     */

    write(collection, content, indentifier=null) {
        return this.mongoClient.connect(this.url, async (err, client) => {
            const db = client.db(this.dbName);

            return db.collection(collection).insertOne(myobj, function (err, res) {
                if (err) throw err;
                client.close();
                return res;
            });
        });
    }

    /**
     * @param {String} collection - Collection name
     * @param {OBject} opts - KEY:VAL Thing to delete 
     */

    delete (collection, opts) {
        return this.mongoClient.connect(this.url, function (err, client) {
            const db = client.db;

            if (err) throw err;
            dbo.collection(collection).deleteOne(opts, function (err, obj) {
                if (err) throw err;
                client.close();
                return obj;
            });
        });
    }

    find (collection, opts) {
        return this.mongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
            if (err) throw err;
            var db = client.db();
            dbo.collection(collection).find(opts).toArray(function (err, result) {
                if (err) throw err;
                client.close();
                return result;
            });
        });
    }
}

module.exports = DataBase;