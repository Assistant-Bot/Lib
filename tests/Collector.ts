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
import {
	Client,
	MessageCollector
} from "../mod.ts";
import {
	assertEquals,
  } from "https://deno.land/std@0.85.0/testing/asserts.ts";
import { TestOptions } from "./mod.ts";
import Message from "../src/structures/Message.ts";
import { MessageData, Snowflake } from "../src/net/common/Types.ts";
import { Sleep } from "../src/util/Async.ts";

export const settings: TestOptions = {
	name: 'Collector',
	description: 'Checks whether collectors work or not.'
}

export default async function() {
	if (!Deno.env.get('DISCORD_TOKEN')) {
		throw new Error('Token not specified');
	}

	let bot: Client = new Client({
		connection: {
			autoReconnect: false
		}
	});

	await bot.connect(Deno.env.get('DISCORD_TOKEN') || "");

	let messages: Message[] = [];

	await new Promise(async (resolve, reject) => {

		setTimeout(async () => {
			const msgData: MessageData = {
				channel_id: "0",
				content: "Cadet is gay",
				author: {
					username: "Unknown",
					id: "0" as Snowflake<18>,
					avatar: "",
					discriminator: "0000"
				},
				timestamp: Date.now().toString(),
				edited_timestamp: null,
				tts: false,
				mention_everyone: false,
				mention_roles: [],
				mention_channels: [],
				mentions: [],
				attachments: [],
				type: 0,
				pinned: false,
				id: "0000000000000000000" as Snowflake<18>
			}
			for (let i = 0; i < 10; i++) {
				bot.emit('message', new Message(bot, msgData));
				await Sleep(100);
			}
		}, 20);
		for await (let msg of new MessageCollector(bot, { limit: 4 }, (msg: Message) => { return true; })) {
			messages.push(msg);
			if (messages.length >= 10) {
				resolve(messages);
			}
		}
	});

	assertEquals(4, messages.length);
}