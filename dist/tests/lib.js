"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Eris = require("eris");
const Assistant = require("../src/mod");
class AdminPermission extends Assistant.Permission {
    constructor() {
        super('Admin', 10);
    }
    can(msg) {
        return msg.member?.permissions.has('administrator');
    }
}
class Everyone extends Assistant.Permission {
    constructor() {
        super('Everyone', 0);
    }
    can(msg) {
        return true;
    }
}
class PingCommand extends Assistant.Command {
    constructor() {
        super('ping', 'ping', 'Get the api response time from the bot to discord.', {
            argOptions: {
                api: 3,
                wrap: true
            },
            cooldown: 0,
            disabledEvents: [],
        });
        this.label = 'ping';
        this.permissions = [
            new Everyone,
            new AdminPermission
        ];
    }
    async onRun(client, msg, args) {
        msg.channel.createMessage('Pong!');
    }
    ;
}
Assistant.PermissionManager.registerAll(new Everyone, new AdminPermission);
const client = new Eris.Client("NzMzOTIwNzkwNDA3MjgyNzU4.XxKLAA.6ro13UZQtvaZVXJggAJZPJJ7Neg");
client.on('ready', () => {
    console.log('Ready!');
});
const handler = new Assistant.CommandHandler(client, {
    prefix: '!',
    allowBots: true,
    allowMention: true
});
handler.registerModule(new Assistant.Module('Generic', [new PingCommand]));
handler.start();
client.connect();
