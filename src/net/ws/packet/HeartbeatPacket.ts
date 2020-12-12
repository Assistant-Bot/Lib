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