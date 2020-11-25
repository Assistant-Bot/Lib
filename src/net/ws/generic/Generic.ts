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
import Client from "../../../Client.ts";
import RuntimeStore from "../../../data/RuntimeStore.ts";
import { Connector } from "../Connector.ts";
import EventPacket from "../packet/EventPacket.ts";
import { Payload } from "../packet/Packet.ts";

export default class Generic extends Connector {
	public sequence: number = 0;
	#client: Client;

	public constructor(client: Client, gateway: string) {
		super(gateway);
		this.#client = client;

		if (client.shardMode !== 'Nodes') {
			throw new Error('Generic connector does not support any mode other than "Nodes"');
		}

		if (!client.dataStore) {
			client.dataStore = new RuntimeStore();
		}
	}

	public async wsPacket(payload: Payload): Promise<void> {
		const packet: EventPacket = EventPacket.from(payload);

		if (this.#client.options.connection.emitPayloads) {
			this.#client.emit('ws', payload);
		}

		// todo: Check the client data provider, and update based on that
	}

	public async wsError(ev: Event | ErrorEvent): Promise<void> {
		console.error(ev);
	}
}