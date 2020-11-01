import * as Eris from 'eris';
import * as Assistant from '../src/mod';

class AdminPermission extends Assistant.Permission {
    public constructor() {
        super('Admin', 10);
    }

    public can(msg: Assistant.Message<Eris.Message>): boolean {
        return msg.member?.permissions.has('administrator');
    }
}

class Everyone extends Assistant.Permission {
    public constructor() {
        super('Everyone', 0);
    }

    public can(msg: Assistant.Message<Eris.Message>): boolean {
        return true;
    }
}

class Owner extends Assistant.Permission {
    public constructor() {
        super('Owner', 100);
    }

    public can(msg: Assistant.Message<Eris.Message>): boolean {
        return msg.member?.guild.ownerID === msg.member?.id
    }
}

class PingCommand extends Assistant.Command {
    public constructor() {
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

    public async onRun(client: Eris.Client, msg: Assistant.Message<Eris.Message>, args: string[]): Promise<void> {
        const m = await msg.channel.createMessage('Pinging...');
        const diff = Math.floor(m.timestamp - (msg?.timestamp || Date.now()));
        m.edit(`Pong! \`${diff}ms\n\`API Pong! \`${msg.channel.guild.shard.latency}ms\``)

    };
}

class TestCommand extends Assistant.Command {
    public constructor() {
        super('test', 'test', 'Test command lol.', {
            argOptions: {
                api: 3,
                wrap: false,
                permissions: [
                    [0, new Everyone], // Will run if you do '!test arg'
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

    public async onRun(client: Eris.Client, msg: Assistant.Message<Eris.Message>, args: string[]): Promise<void> {
        console.log('Owner only command!')

    };
}

Assistant.PermissionManager.registerAll(
    new Everyone, new AdminPermission, new Owner
);

const client = new Eris.Client("NzHi.Your.Bad-Lol");

client.on('ready', () => {
    console.log('Ready!');
})

const handler = new Assistant.CommandHandler(client, {
    prefix: '!',
    allowBots: true,
    allowMention: true
});
handler.registerModule(new Assistant.Module('Generic', [ new PingCommand, new TestCommand ]));
handler.start();
client.connect();
