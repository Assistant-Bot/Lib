/**
 * Default code generation for Assistant
 * @param name 
 * @param token 
 */
export default async function generateDefault(name: string, token: string,) {
	await Deno.mkdir('src');
	// Deno.writeTextFile('import_map.json', JSON.stringify({
	// 	imports: {
	// 		assistant: "deps.ts"
	// 	}	
	// }));
	// Deno.writeTextFile('deps.ts', "export * as Assistant from 'https://raw.githubusercontent.com/Assistant-Bot/Lib/master/mod.ts'")

	/// TODO: Allow dev branch code gen
	Deno.writeTextFile('src/mod.ts', 
	`import { Client, CommandHandler, Message, Intents } from 'https://raw.githubusercontent.com/Assistant-Bot/Lib/master/mod.ts'
	
const client = new Client(${token || 'TOKEN'}, {intents: Intents.all().parse()});
const commandHandler = new CommandHandler(client, {prefix: "!"});

client.on('ready', () => {
	console.log("Ready", client.user.tag);
});

client.on('message', (msg: Message) => {
	if(msg.content === '!ping') {
		msg.reply("**Pong!**");
	}
	
	/// return await commandHandler.processMessage(msg);
});

client.connect(JSON.parse(new TextDecoder().decode(Deno.readFileSync(Deno.cwd() + '/config.json'))).token)
	`);

	Deno.writeTextFile('./config.json', JSON.stringify({
		name,
		token
	}))
}