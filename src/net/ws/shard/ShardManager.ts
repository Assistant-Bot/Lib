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
import Client from "../../../Client.ts";
import Intents from "../../../util/Intents.ts";
import { Connector } from "../Connector.ts";
import Packet, { Payload } from "../packet/Packet.ts";
import WSManager from "../WSManager.ts";

export default class Shard implements WSManager {
	public send(payload: Payload, specifier?: any) {
		throw new Error("Method not implemented.");
	}
	public sendPacket(packet: Packet, specifier?: any) {
		throw new Error("Method not implemented.");
	}
	public close(): void | Promise<void> {
		throw new Error("Method not implemented.");
	}
	public connect(token: string, intents: Intents) {
		throw new Error("Method not implemented.");
	}
}