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
import { Snowflake } from "../common/Types.ts";

export const REST_VERSION: string = 'v8';
export const GATEWAY: string = '/gateway'
export const BASE_URL: string = 'https://discord.com/api/' + REST_VERSION;
export const GATEWAY_URL: string = 'wss://gateway.discord.gg/?v=8&encoding=json';

export default class Endpoints {
	public static channel(id: string): string {
		return '/channels/' + id;
	}

	public static channel_purge(id: string): string {
		return this.channel(id) + '/messages/bulk-delete';
	}

	public static channel_ring(id: string): string {
		return this.channel(id) + '/call/ring';
	}

	public static channel_crosspost(id: string, messageId: string): string {
		return this.channel(id) + '/messages/' + messageId + '/crosspost';
	}

	public static channel_resolve(id: string, ...additional: string[]): string {
		return this.channel(id) + '/' + additional.join('/');
	}

	public static channel_messages(id: string): string {
		return this.channel(id) + '/messages'
	}

	public static guild(id: string): string {
		return '/guilds/' + id;
	}

	public static guild_resolve(id: string, ...additional: string[]): string {
		return this.channel(id) + '/' + additional.join('/');
	}

	public static rest_gateway(bot: boolean): string {
		return BASE_URL + GATEWAY + ((bot) ? '/bot' : '');
	}
}