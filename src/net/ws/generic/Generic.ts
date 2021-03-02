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
import RuntimeManager from "../../../data/runtime/RuntimeManager.ts";
import { Connector } from "../Connector.ts";

export default class Generic extends Connector {
	public sequence: number = 0;

	public constructor(client: Client, gateway: string) {
		super(client, gateway);
		if (client.shardMode !== 'Nodes') {
			throw new Error('Generic connector does not support any mode other than "Nodes"');
		}

		if (!client.dataManager) {
			client.dataManager = new RuntimeManager(client.options.cache?.limit);
		}
	}
}