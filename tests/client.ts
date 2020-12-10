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
 * This test checks whether or not the client is functioning with the websocket provider properly.
 * If there are not any websocket events being emitted from the client, then something is wrong.
 *
 * @template client
 */
import Client from "../src/Client.ts";
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

client.on("message", async (msg: Message) => {
	const cmd: string = msg.getCommand("!");

	if (cmd === "dump") {
		//@ts-ignore
		const access: any = msg[msg.args[0]] || "[error] Unknown property";

		if (typeof access === "string") {
			msg.channel.sendBlock('xl', access);
		} else {
			msg.channel.sendBlock('js', Deno.inspect(access, { depth: 2, getters: true }).split('').slice(0, 1971).join(''));
		}
	}

	if (cmd === "eval") {
		if (msg.author.id !== client.application?.owner.id) {
			return msg.channel.send('Preserved for bot owners.');
		}

		try {
			let code = msg.args.join(" ");
			let evaled = eval(code);
			evaled = Deno.inspect(evaled, {
				depth: 2,
				colors: false,
				getters: true
			});
			if (evaled.length >= 2000) {
				evaled = evaled.split("").slice(0, 1971).join("") +
					"\nMessage shortened";
			}
			msg.channel.sendBlock('js', evaled);
		} catch (err) {
			msg.channel.sendBlock('js', err);
		}
	}

	if (cmd === "ping") {
		let m: Message = await msg.channel.send('Pinging...');
		m.edit(`:ping_pong: **Pong!** ${m.timestamp - msg.timestamp} ms`);
	}

	// Please do not add anymore commands to this file.
	// Just clone it and make the file name "client-h.ts" so you don't commit it.
});
client.connect(JSON.parse(new TextDecoder().decode(Deno.readFileSync('./tests/config.json'))).token);