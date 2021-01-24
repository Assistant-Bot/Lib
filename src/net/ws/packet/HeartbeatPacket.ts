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
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 */
import Packet, { OPCode, Payload } from "./Packet.ts";

export default class HeartBeatPacket extends Packet {
	public interval: number;

	public static from(p: Payload): HeartBeatPacket {
		return new this(p.d.heartbeat_interval || 45000);
	}

	public constructor(interval: number) {
		super(OPCode.HEARTBEAT);
		this.interval = interval;
	}

	protected encodeData(): void {
		this.data = this.interval;
	}
}