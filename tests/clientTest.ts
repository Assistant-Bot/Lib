/***
 *                    _     _              _
 *      /\           (_)   | |            | |
 *     /  \   ___ ___ _ ___| |_ __ _ _ __ | |_
 *    / /\ \ / __/ __| / __| __/ _` | '_ \| __|
 *   / ____ \\__ \__ \ \__ \ || (_| | | | | |_
 *  /_/    \_\___/___/_|___/\__\__,_|_| |_|\__|
 *
 * Copyright (C) 2020 John Bergman
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
 * @template clientTest
 */
import Client from "../src/Client.ts";
import type Message from "../src/structures/Message.ts";

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


client.connect(JSON.parse(new TextDecoder().decode(Deno.readFileSync('./tests/config.json'))).token);

client.on('message', (message: Message) => {
	console.log(message);
})