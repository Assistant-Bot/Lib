const client = require('./client.js');
const Pager = require("../pager/pager.js");
const store = require('./store.js');
const Events = require('events');

client.on("messagereactionAdd", async (reaction, user) => {
    store.tasks.forEach(task => {
        if(task.settings.authorOnly === false) return task.emit("add", reaction);
        if(task.settings.authorOnly !== user.id) return;
        else return task.emit("add", reaction);
    });
});
client.on("messagereactionRemove", async (reaction, user) => {
    store.tasks.forEach(task => {
        if(task.settings.authorOnly === false) return task.emit("del", reaction);
        if(task.settings.authorOnly !== user.id) return;
        else return task.emit("del", reaction);
    });
});

function ReactionTaskFunc(data) {
    const ReactTask = new ReactionTask(data);
    ReactTask.on("add", (data) => {
        
    });

    ReactTask.on("del", (data) => {

    });
}
class ReactionTask extends Events {
    constructor(data) {
        super();
        this.settings = this.handleData(data);
        this.pager = new Pager(this.settings.data, 10);
        this.emojiObj = {
            id: 0,
            name: ":emoji:",
            task: "topage +1"
        }

        this.errors = {
            "emojiError": "Emoji at index: {index} is not a valid emoji ReactionEmoji Object."
        }
    }

    handleData(data) {
        if((data instanceof Object) === false) throw "Data supplied must be a Object.";
        if(!data.emojis) throw "Data supplied must be a reaction settings object. - Missing Parameter: emojis";
        if(!data.data) throw "Data supplied must be a reaction settings object. - Missing Parameter: data";
        if(!data.msg) throw "Data supplied must be a reaction settings object. - Missing Parameter: msg";
        /* Get emoji Object */
        const emojiCheck = this.checkKeys(this.data.emojis, this.emojiObj, this.errors.emojiError);
        if(emojiCheck.passed == false) throw emojiCheck.error;
    }

    checkKeys(obj, checker, onError) {
        let returnable = {
            passed: true,
            error: false
        }

        for (let i = 0; i < obj.length; i++) {
            let value = obj[i];
            if(Object.keys(value) !== Object.keys(checker)) {
                returnable.passed = false;
                returnable.error = onError.replace("{index}", i);
                return returnable;
            }
        }
    };
}

exports.ReactionTask = ReactionTaskFunc;