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
import { assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";
import { Connector } from "../src/net/ws/Connector.ts";

/**
 * Connects to the gateway, disconnects, then resumes.
 */
Deno.test({
	name: 'Resume and Application',
	fn: async () => {
		let b: Client = new Client({
			connection: {
				autoReconnect: false,
				respectDiscordGateway: false
			}
		});

		b.connect(Deno.env.get('DISCORD_TOKEN') || "");

		await new Promise((resolve, reject) => {
			let iteration: number = 0;
			let first: string = "";
			setTimeout(reject, 10000);
			b.on('ready', (id: string) => {
				try {
				if (iteration === 0) {
					first = id;
					b.disconnect();
					if (b.ws instanceof Connector) {
						b.ws.reconnect();
					}
					iteration++;
				} else {
					b.disconnect();
					resolve(assertEquals(first, id));
				}
				} catch (e) { reject(e) }
			});
		});
	},
	sanitizeResources: true,
	sanitizeOps: false,
	ignore: true
});