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
import type { GatewayEvent } from "./EventPacket.ts";

export enum OPCode {
	DISPATCH = 0,
	HEARTBEAT = 1,
	IDENTIFY = 2,
	STATUS = 3,
	VOICE = 4,
	RESUME = 6,
	RECONNECT = 7,
	GUILDMEMBER = 8,
	INVALID_SESSION = 9,
	HELLO = 10,
	HEARTBEAT_ACK = 11,
	SYNC_GUILD = 12,
	SYNC_CALL = 13,
}

export interface Payload {
	t?: GatewayEvent;
	s?: number;
	op: OPCode;
	d: any;
}

export default abstract class Packet {
	protected data: any = {};
	protected type?: GatewayEvent;
	private opCode: OPCode;

	public constructor(op: OPCode, type?: GatewayEvent) {
		this.opCode = op;
		this.type = type;
	}

	public encode(): Payload {
		this.encodeData();
		return {
			d: this.data,
			op: this.opCode,
			t: this.type
		}
	}

	/**
	 * Encode the data onto the packet class.
	 */
	protected abstract encodeData(): void;

	/**
	 * Runs when the payload is decoded.
	 * Developers can use this to register custom packets.
	 */
	public decodeData(): void { };
}