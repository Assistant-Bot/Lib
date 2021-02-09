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
import Intents from "../../util/Intents.ts";
import Packet, { Payload } from "./packet/Packet.ts";

export default interface WSManager {
	/**
	 * Sends a payload to the websocket.
	 * @param payload
	 *
	 * ⚠ Use specifier for identity! (eg guilds)
	 */
	send(payload: Payload, specifier?: any): any;

	/**
	 * Sends a packet to the websocket
	 *
	 * ⚠ Use specifier for identity! (eg guilds)
	 */
	sendPacket(packet: Packet, specifier?: any): any;

	/**
	 * Disconnects any members and terminates the manager.
	 */
	close(): void | Promise<void>;

	/**
	 * Connect (called once) to the gateway.
	 *
	 * ⚠ You are responsible for handling things like "shards"
	 */
	connect(token: string, intents: Intents): any;
}