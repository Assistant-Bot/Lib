class ErrorMessage {
    constructor (msg, title, desc, emojis) {
        return msg.channel.send(`${emojis.redtick} **${title}** ${desc}`);
    }
}

module.exports = ErrorMessage;