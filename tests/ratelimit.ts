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
 * This test handles responses disregarding ratelimiting.
 * If you want a request to resolve eventually, set the "attemptsRatelimit" to infinity in RequestHandlerOptions.
 *
 * @template ratelimit
 */
import RequestHandler from "../src/net/rest/RequestHandler.ts";

const handler: RequestHandler = new RequestHandler({}, [
    { name: 'Authorization', value: 'Bot ' + JSON.parse(new TextDecoder().decode(Deno.readFileSync('./tests/config.json'))).token }
]);


console.log('Executing all...');
Promise.all([
    handler.request(new Request('https://discord.com/api/v8/gateway/bot')),
    handler.request(new Request('https://discord.com/api/v8/gateway/bot')),
    handler.request(new Request('https://discord.com/api/v8/gateway/bot')),
    handler.request(new Request('https://discord.com/api/v8/gateway/bot')),
    handler.request(new Request('https://discord.com/api/v8/guilds/771479857514676245')),
    handler.request(new Request('https://discord.com/api/v8/guilds/771479857514676245/channels')),
    handler.request(new Request('https://discord.com/api/v8/guilds/771479857514676245/bans'))
]).then((responses: Response[]) => {
    responses.forEach(resp => {
        console.log('Recived response: ' + resp.statusText + ' from: ' + resp.url);
    })
}).catch((r) => {
    console.log('Failed: ' + r);
})