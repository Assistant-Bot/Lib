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

class PingCommand extends Assistant.Command {
    public constructor() {
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

    public async onRun(client: Eris.Client, msg: Assistant.Message<Eris.Message>, args: string[]): Promise<void> {
        msg.channel.createMessage('Pong!');
    };
}

Assistant.PermissionManager.registerAll(
    new Everyone, new AdminPermission
);

const client = new Eris.Client("NzMzOTIwNzkwNDA3MjgyNzU4.XxKLAA.6ro13UZQtvaZVXJggAJZPJJ7Neg");

client.on('ready', () => {
    console.log('Ready!');
})

const handler = new Assistant.CommandHandler(client, {
    prefix: '!',
    allowBots: true,
    allowMention: true
});
handler.registerModule(new Assistant.Module('Generic', [ new PingCommand ]));
handler.start();
client.connect();
