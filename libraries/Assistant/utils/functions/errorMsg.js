module.exports = (msg, emojis, type='unknown', other='Unknown Node') => {
    if (type == 'perm') {
        return msg.channel.send(emojis.redtick + 'I need **' + other + '** permissions to perform this command.');
    }

    if (type == 'noperm') {
        return msg.channel.send(emojis.redtick + 'You need **' + other + '** permissions to perform this command.');
    }

    if (type == 'unknown') {
        return msg.channel.send(emojis.redtick + ' An unexpected error occured.');
    }
}