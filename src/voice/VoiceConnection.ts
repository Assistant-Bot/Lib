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
import Client from "../Client.ts";

export enum VoiceConnectionState {
	Ready = 0,
	Connecting,
	Connected,
	Reconnecting,
	Disconnecting,
	Disconnected,
	Terminated
}

/**
 * Voice Connections!
 * This class represents a voice connection (udp/web) socket,
 * which is similar to "Connector"
 *
 *     const vc = new VoiceConnection("")
 */
export default class VoiceConnection {
	#state: VoiceConnectionState;
	#client: Client;

	public constructor(client: Client) {
		this.#state = VoiceConnectionState.Ready;
		this.#client = client;
	}
}