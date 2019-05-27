const Eventer = require('events');
const ReactionTask = require('../Client/tasks.js').ReactionTask;

class EmbedManager extends ReactionTask {
    constructor(msgID, data) {
        this.settings = data;

        super();
    }

    setEmojis(arr) {

    }

    removeEmoji(arr) {

    }
    
}

module.exports = EmbedManager;