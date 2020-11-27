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