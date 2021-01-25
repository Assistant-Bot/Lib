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
 * Checks whether or not the cache feature is functioning as should be.
 * @template cache
 */
import Client from "../src/Client.ts";
import Message from "../src/structures/Message.ts";

const client = new Client({
	cache: {
		limit: 1
	}
});

client.on('message', (message: Message)=> {
	console.log("Current Cache size for Messages: " + client.messages.size);
});

client.on('ready', () => {
	console.log("Current limit is: " + client.dataManager?.limit || 0);
});

client.connect(JSON.parse(new TextDecoder().decode(Deno.readFileSync('./tests/config.json'))).token);