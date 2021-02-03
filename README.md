# Assistant v3

Assistant v3 Library Source Code used in Assistant Bot. <br />
This code is licensed under **GNU General Public License v3**.


## What is AssistantLib?
AssistantLib is a powerful, extensible framework to create a bot quickly, and easily.
This framework is currently being developed and will be used for **Assistant Bot**.

### Why use AssistantLib?
- It uses Typescript's powerful type system to write simple, type-safe, and elegant code
	- Object Oriented
	- Created with completely type safe code
- Zero third-party dependencies
	- Only uses the latest version of Deno standard library
- Benchmarks with incredible gateway speeds
	- 250-500 m/s gateway login speeds!
- Enhanced for speed and memory
	- Uses 10-15x less memory that Node.JS libraries
- Includes multiple developer utilities such as live module reloader and a CLI
- Optimal API Coverage
- Has full fledged slash (/) command support
	- The first library (if not one of the first) to implement slash commands!
- Empowers the developer! What do we mean? We've made Assistant as extensible as possible to make sure it can suit the developers needs whenever they need to extends features
	- Create custom websocket handlers
	- Create custom REST API Handlers
	- Create custom structures
	- Create custom collectors
	- Create custom caching environments (do I hear Mongo and Redis?)

#### Special Code Examples

Get a command directly from a message!
```ts
client.on('message', (msg: Message) => {
	const commandName = msg.getCommand("!");
});
```

Elegant collector syntax!
```ts
client.on('message', (msg: Message) => {
	const commandName = msg.getCommand("!");
	switch(commandName) {
		case 'collect': {
			const msgs = new MessageCollector(client, {limit: 10});
			// Asynchronously iterate over
			// incoming messages!
			for await (const message of msgs) {
				console.log("NEW MESSAGE!!", message);
			}
		}
	}
});

```

Complete client configuration!
```ts
const CACHE_CAP = 1000;
const client = new Client({
	sharding: {
		useDiscord: false,
	},
	connection: {
		emitPayloads: false,
		autoReconnect: true,
		compress: false,
		maxReconnectTries: 1,
		maxResumeTries: 1,
		respectDiscordGateway: true,
		timeout: 1000
	},
	intents: Intents.all().parse(),
	cache: { 
		limit: CACHE_CAP,
	}
}, new RuntimeManager(CACHE_CAP));
```

Use the advanced CLI to create project boilerplates in mere milliseconds 
```ps1
deno install -A -f -n ast https://raw.githubusercontent.com/Assistant-Bot/Lib/dev/src/util/cli.ts

# Then use the following to create a boilerplate
ast gen MyEpicBot TOKEN
```

Use the advanced Command and Module API without writing any command handling code from scratch!
```ts
const client = new Client();

class AdminPermission extends Permission {
	public constructor() {
		super('generic.permission.admin', 100);
	}

	public can(msg: Message, member: Member) {
		return member.permissions.has('administrator');
	}
}

class AdminCommand extends Command {
	public constructor() {
		super('admin', 'generic.command.admin', 'An admin command!');
		this.permissions = [new AdminPermission()];
		this.aliases = ['adm', 'a']
	}

	public async onRun(client: Client, msg: Message, args: string[]) {
		msg.reply('An admin command!')
	}
}

const commandHandler = new CommandHandler(client, {prefix: "!"});
commandHandler.registerModule(new Module('Admin', [new AdminCommand()], [new AdminPermission()], true));
```