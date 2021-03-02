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
	Client
} from "../mod.ts";
import {
	assertEquals,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

const commonOpts = {
	sanitizeResources: false,
	sanitizeOps: false
}
/**
 * Connects to the gateway and checks to see if the session is valid.
 */
Deno.test({
	name: 'Hello',
	fn: async () => {
		if (!Deno.env.get('DISCORD_TOKEN')) {
			throw new Error('Token not specified');
		}

		let bot: Client = new Client({
			connection: {
				autoReconnect: false
			}
		});

		await bot.connect(Deno.env.get('DISCORD_TOKEN') || "");

		await new Promise((resolve, reject) => {
			bot.events.once('ready', async (id: string) => {
				await bot.disconnect();
				assertEquals<number>(id.length, 32, "Invalid session id. (Discord might be offline!)")
				assertEquals(typeof id, "string", "Could not find bot session id.");
				resolve(id);
			});
		});
	},
	...commonOpts
});