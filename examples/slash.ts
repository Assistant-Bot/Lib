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
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 3
 * of the License, or (at your option) any later version.
 */

/**
 * This test is only to test whether or not slash commands work.
 *
 * @template slash
 */
import Client from "../src/Client.ts";
import { Payload } from "../src/net/ws/packet/Packet.ts";
import AppCommand from "../src/structures/application/AppCommand.ts";
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
	//console.log(Deno.inspect(m, { depth: 2 }));
})

await client.connect(JSON.parse(new TextDecoder().decode(Deno.readFileSync('./tests/config.json'))).token);

setTimeout(() => {
	AppCommand.create(client, {
		name: 'eval',
		description: 'Evaluates JS Code.',
		application_id: client.user.id,
		guildId: '771479857514676245'
	});
}, 2000);