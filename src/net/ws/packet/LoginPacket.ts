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
import Packet, { OPCode, Payload } from "./Packet.ts";

export default class LoginPacket extends Packet {
	public token: string;
	public compress: boolean;
	public intents: number;
	#user: boolean;

	public static from(p: Payload, intents: number): LoginPacket {
		return new this(p.d.token, p.d.compress, intents);
	}

	public constructor(token: string, compress: boolean = false, intents: number = 0, user: boolean = false) {
		super(OPCode.IDENTIFY);
		this.token = token;
		this.compress = compress;
		this.intents = intents;
		this.#user = user;
	}

	protected encodeData(): void {
		this.data = {
			token: this.token,
			v: 6,
			compress: this.compress,
			intents: this.intents,
			properties: {
				os: Deno.build.os,
				browser: this.#user ? 'Firefox' : 'Assistant-v3',
				device: this.#user ? '' : 'Assistant-v3'
			},
		}
	}
}