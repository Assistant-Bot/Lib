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
 * This test handles responses disregarding ratelimiting.
 *
 * @template ratelimit2
 */
import DiscordRequestHandler from "../src/net/rest/DiscordRequestHandler.ts";

const handler: DiscordRequestHandler = new DiscordRequestHandler({}, [
    { name: 'Authorization', value: 'Bot ' + JSON.parse(new TextDecoder().decode(Deno.readFileSync('./tests/config.json'))).token }
]);

for (let i = 0; i < 15; i++) {
	/**
	 * the last 5 should send after 10 seconds of process runtime
	 * We're using await here so requests aren't sent out of sync.
	 * While you can do this without await, there is no queue in place
	 * to check if messages sent will be in sequence.
	 */
	await handler.createMessage('771481647479783424', { content: 'Test Ratelimit Iteration: ' + i });
}