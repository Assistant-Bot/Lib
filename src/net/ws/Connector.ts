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
import { GATEWAY, BASE_URL } from '../rest/Endpoints.ts';
import EventPacket from "./packet/EventPacket.ts";
import HeartBeatPacket from "./packet/HeartbeatPacket.ts";
import LoginPacket from "./packet/LoginPacket.ts";
import Packet, { OPCode, Payload } from "./packet/Packet.ts";
import ResumePacket from "./packet/ResumePacket.ts";

export type ConnectionStates = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED' | 'INITIALIZED';

export abstract class Connector {
	public ws!: WebSocket;
	public sequence: number;
	public sessionId?: string;
	#gateway: string;
	#token!: string;
	#lastSeq: number;
	#lastAck: number;
	#shouldDisconnect: boolean;
	#shouldReconnect: boolean;
	#state: ConnectionStates;
	#heartInterval?: number;
	#intents: Intents;
	#shard: number;

	public constructor(gateway: string) {
		this.#gateway = gateway;
		this.sequence = 0;
		this.#lastSeq = 0;
		this.#lastAck = -1;
		this.#state = 'INITIALIZED';
		this.#shouldDisconnect = false;
		this.#shouldReconnect = false;
		this.#intents = Intents.defaults();
		this.#shard = 0;
	}

	/**
	 * Connects to the discord websocket based on the token.
	 * @param token - The token to pass to the Discord gateway
	 */
	public async connect(token: string, intents: Intents): Promise<void> {
		this.#token = token;
		this.#intents = intents;
		this.#state = 'CONNECTING';
		this.#lastSeq = 0;
		this.ws = new WebSocket(this.#gateway);
		this.ws.onmessage = this.wsMessage.bind(this);
		this.ws.onerror = this.wsError.bind(this);
		this.ws.onopen = () => {
			this.#state = 'CONNECTED';
		}
		this.ws.onclose = async () => {
			this.#state = 'DISCONNECTED';
			if (this.#heartInterval) {
				clearInterval(this.#heartInterval);
			}
			if (!this.#shouldDisconnect) {
				await this.connect(token, intents);
			}
		}
	}

	/**
	 * Send a payload to discord.
	 * @param payload
	 */
	public async send(payload: Payload): Promise<void> {
		try {
			// to-do handle zlib
			this.ws.send(JSON.stringify(payload));
			return;
		} catch (e) {
			//console.error(e);
			return;
		}
	}

	/**
	 * Send a packet to discord.
	 * @param packet
	 */
	public async sendPacket(packet: Packet): Promise<void> {
		return this.send(packet.encode());
	}

	/**
	 * Close the websocket
	 */
	public async close(): Promise<void> {
		try {
			this.ws.close();
		} catch (e) {
			return;
		}
	}

	public async reconnect(): Promise<void> {
		this.close();
		this.#shouldReconnect = true;
		this.connect(this.#token, this.#intents);
	}

	/**
	 * Gets the state of the connection
	 * @readonly
	 */
	public get state(): ConnectionStates {
		return this.#state;
	}

	/**
	 * Called when the websocket recieves a payload from discord.
	 * @param p
	 */
	public abstract wsPacket(p: Payload): any;

	/**
	 * Called when the websocket encounters an error.
	 * @param error
	 */
	public abstract wsError(error: Event | ErrorEvent | Error): any;

	private wsMessage(ev: MessageEvent): void {
		const payload: Payload = JSON.parse(ev.data) || false;
		let packet: EventPacket | HeartBeatPacket | ResumePacket;

		if (!payload) {
			this.wsError(new Error('Invalid payload recieved'));
		}

		switch (payload.op) {
			case OPCode.HELLO:
				packet = HeartBeatPacket.from(payload);
				this.#shouldReconnect = !this.#shouldReconnect ? !!this.#heartInterval : this.#shouldReconnect;
				this.#heartInterval = setInterval(() => {
					// @ts-ignore
					try {
						this.sendPacket(packet);
					} catch (e) {
						// not connected?
						if (this.ws.readyState !== this.ws.OPEN) {
							console.error(new Error('Sent heartbeat while socket is disconnected. Reconnecting soon.'));
							this.#state = 'DISCONNECTED';
						} else {
							console.error(e);
						}
					}
				}, packet.interval);
				if (this.#shouldReconnect) {
					this.sendPacket(new ResumePacket(this.#token, this.sessionId, this.sequence));
					if (!!this.#heartInterval) {
						clearInterval(this.#heartInterval);
					}
				} else {
					this.sendPacket(new LoginPacket(this.#token, false, this.#intents.parse(), false));
				}
				return;
			case OPCode.RECONNECT:
				packet = new ResumePacket(this.#token, this.sessionId, this.#lastSeq);
				this.sendPacket(packet);
				return;
			case OPCode.DISPATCH:
				packet = EventPacket.from(payload);
				this.#lastSeq = packet.sequence || this.#lastSeq;
				this.sequence = this.#lastSeq;

				if (packet.event === 'READY') {
					this.sessionId = packet.data.session_id;
					this.#shard = packet.data.shard;
					// todo: Handle multiple guilds
				}
				break;
			case OPCode.HEARTBEAT:
				this.#lastAck = Date.now();
				return;
			case OPCode.INVALID_SESSION:
				this.#shouldDisconnect = true;
				return;
			default:
				break;
		}

		this.wsPacket(payload);
	}
}