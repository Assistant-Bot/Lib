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

export default class ResumePacket extends Packet {
	public token?: string;
	public sessionId?: string;
	public lastSequence?: number;

	public static from(data: Payload): ResumePacket {
		return new this(data.d.token, data.d.session_id, data.d.seq);
	}

	constructor(token?: string, sessionId?: string, lastSequence?: number) {
		super(OPCode.RESUME);
		this.token = token;
		this.sessionId = sessionId;
		this.lastSequence = lastSequence;
	}

	protected encodeData(): void {
		this.data = {
			token: this.token,
			session_id: this.sessionId,
			seq: this.lastSequence,
		};
	}
}