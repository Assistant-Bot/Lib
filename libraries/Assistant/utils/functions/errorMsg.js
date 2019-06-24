module.exports = (msg, emojis, type='unknown', other='Unknown Node') => {
    if (type == 'perm') {
        return msg.channel.send(emojis.redtick + 'I need **' + other + '** permissions to perform this command.');
    }

    if (type == 'alias') {
        return msg.channel.send(emojis.redtick + 'Incorrect usage, try `help ' + other + '` for more info.');
    }

    if (type == 'custom') {
        return msg.channel.send(emojis.redtick + ' ' + other);
    }

    if (type == 'warn') {
        return msg.channel.send(emojis.warning + ' ' + other);
    }

    if (type == 'argErr') {
        return msg.channel.send(emojis.redtick);
    }

    if (type == 'noperm') {
        return msg.channel.send(emojis.redtick + 'You need **' + other + '** permissions to perform this command.');
    }

    if (type == 'unknown') {
        return msg.channel.send(emojis.redtick + ' An unexpected error occured.');
    }
}