module.exports = (eris) => {
    Object.defineProperty(eris.TextChannel.prototype, 'send', (content) => {
        return this.createMessage(content);
    });
    if (!eris.TextChannel.send) {
        Object.defineProperty(eris.TextChannel.prototype, 'send', (content) => {
            return this.createMessage(content);
        });
    }
    if (!eris.User.tag) {
        Object.defineProperty(eris.User.prototype, 'tag', {
            get: function () {
                return `${this.username}#${this.discriminator}`;
            }
        });
    }

    if (!eris.Message.guild) {
        Object.defineProperty(eris.Message.prototype, 'guild', {
            get: function () {
                return this.channel.guild;
            }
        });
    }

    if (!eris.Member.hasPermission) {
        Object.defineProperty(eris.Member.prototype, 'hasPermission', {
            get: function (perm) {
                let permissions = this.permission;
                if (!Object.keys(permissions).includes(perm)) return null;
                return permissions[perm];
            }
        });
    }
    return eris;
}