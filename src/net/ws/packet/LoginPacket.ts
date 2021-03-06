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
import Packet, { OPCode, Payload } from "./Packet.ts";

export default class LoginPacket extends Packet {
	public token: string;
	public compress: boolean;
	public intents: number;
	public shards: number;
	#user: boolean;

	public static from(p: Payload, intents: number): LoginPacket {
		return new this(p.d.token, p.d.compress, intents);
	}

	public constructor(token: string, compress: boolean = false, intents: number = 0, user: boolean = false, shards: number = 0) {
		super(OPCode.IDENTIFY);
		this.token = token;
		this.compress = compress;
		this.intents = intents;
		this.#user = user;
		this.shards = shards;
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
			shards: this.shards ? new Array(this.shards).map((_, i) => [i, this.shards]) : undefined
		}
	}
}