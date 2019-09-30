module.exports = (msg, emojis, type='unknown', other='Unknown Node') => {
    if (type == 'perm') {
        return msg.channel.send(emojis.red_x + 'I need **' + other + '** permissions to perform this command.');
    }

    if (type == 'alias' || type == 'usage') {
        return msg.channel.send(emojis.red_x + 'Incorrect usage, try `help ' + other + '` for more info.');
    }

    if (type == 'custom') {
        return msg.channel.send(emojis.red_x + ' ' + other);
    }

    if (type == 'warn') {
        return msg.channel.send(emojis.warning + ' ' + other);
    }

    if (type == 'argErr') {
        return msg.channel.send(emojis.red_x);
    }

    if (type == 'noperm') {
        return msg.channel.send(emojis.red_x + 'You need **' + other + '** permissions to perform this command.');
    }

    if (type == 'unknown') {
        return msg.channel.send(emojis.red_x + ' An unexpected error occured.');
    }
}