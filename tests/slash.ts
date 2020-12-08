/***
 *                    _     _              _
 *      /\           (_)   | |            | |
 *     /  \   ___ ___ _ ___| |_ __ _ _ __ | |_
 *    / /\ \ / __/ __| / __| __/ _` | '_ \| __|
 *   / ____ \\__ \__ \ \__ \ || (_| | | | | |_
 *  /_/    \_\___/___/_|___/\__\__,_|_| |_|\__|
 *
 * Copyright (C) 2020 Bavfalcon9
 *
 * This is private software, you cannot redistribute and/or modify it in any way
 * unless given explicit permission to do so. If you have not been given explicit
 * permission to view or modify this software you should take the appropriate actions
 * to remove this software from your device immediately.
 */

/**
 * This test is only to test whether or not slash commands work.
 *
 * @template slash
 */
import Client from "../src/Client.ts";
import { Payload } from "../src/net/ws/packet/Packet.ts";
import Message from "../src/structures/Message.ts";

const client = new Client({
	sharding: {
		useDiscord: true
	},
	connection: {
		emitPayloads: true,
		autoReconnect: true,
		compress: false,
		maxReconnectTries: 1,
		maxResumeTries: 1,
		respectDiscordGateway: true,
		timeout: 1000
	}
});

client.on('message', (message: Message)=> {
	if (message.content === '!assistant') {
		message.channel.send("Recieved response!");
	}
})

client.on('ws', (m: Payload) => {
	console.log(Deno.inspect(m, { depth: 2 }));
})

await client.connect(JSON.parse(new TextDecoder().decode(Deno.readFileSync('./tests/config.json'))).token);

client.sendPayload({
	t: "GUILD_APPLICATION_COMMANDS_UPDATE",
	op: 0,
	d: {
		guild_id: "771479857514676245",
		applications_commands: [
			{
				name: "test",
				description: "Hi there, i do something"
			}
		]
	}
})