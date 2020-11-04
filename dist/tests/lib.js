"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Eris = require("eris");
const Assistant = require("../src/mod");
class AdminPermission extends Assistant.Permission {
    constructor() {
        super('Admin', 10);
    }
    can(msg) {
        return !!msg.member?.permissions?.has('administrator');
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
class Owner extends Assistant.Permission {
    constructor() {
        super('Owner', 100);
    }
    can(msg) {
        return msg.member?.guild.ownerID === msg.member?.id;
    }
}
class PingCommand extends Assistant.Command {
    constructor() {
        super('ping', 'ping', 'Get the api response time from the bot to discord.', {
            argOptions: {
                api: 3,
                wrap: false
            },
            cooldown: 0,
            disabledEvents: [],
        });
        this.permissions = [
            new Everyone,
            new AdminPermission
        ];
    }
    async onRun(client, msg, args) {
        const m = await msg.channel.createMessage('Pinging...');
        const diff = Math.floor(m.timestamp - (msg?.timestamp || Date.now()));
        m.edit(`Pong! \`${diff}ms\n\`API Pong! \`0 ms\``);
    }
    ;
}
class TestCommand extends Assistant.Command {
    constructor() {
        super('test', 'test', 'Test command lol.', {
            argOptions: {
                api: 3,
                wrap: false,
                permissions: [
                    [0, new Everyone],
                    [1, new Owner] // Will only work if you are owner and do '!test arg ownerArg'
                ],
            },
            cooldown: 0,
            disabledEvents: [],
        });
        this.permissions = [
            new Everyone
        ];
    }
    async onRun(client, msg, args) {
        console.log('Owner only command!');
    }
    ;
}
Assistant.PermissionManager.registerAll(new Everyone, new AdminPermission, new Owner);
const client = new Eris.Client("NzHi.Your.Bad-Lol");
client.on('ready', () => {
    console.log('Ready!');
});
const handler = new Assistant.CommandHandler(client, {
    prefix: '!',
    allowBots: true,
    allowMention: true
});
handler.registerModule(new Assistant.Module('Generic', [new PingCommand, new TestCommand]));
client.connect();
