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
import Packet, { OPCode, Payload } from "./Packet.ts";

/**
 * Please note these may be outdated at times.
 */
export type GatewayEvent =
	| 'HELLO'
	| 'READY'
	| 'RESUMED'
	| 'RECONNECT'
	| 'INVALID_SESSION'
	| 'CHANNEL_CREATE'
	| 'CHANNEL_UPDATE'
	| 'CHANNEL_DELETE'
	| 'CHANNEL_PINS_UPDATE'
	| 'GUILD_CREATE'
	| 'GUILD_UPDATE'
	| 'GUILD_DELETE'
	| 'GUILD_BAN_ADD'
	| 'GUILD_BAN_REMOVE'
	| 'GUILD_EMOJIS_UPDATE'
	| 'GUILD_INTEGRATIONS_UPDATE'
	| 'GUILD_MEMBER_ADD'
	| 'GUILD_MEMBER_UPDATE'
	| 'GUILD_MEMBER_CHUNK'
	| 'GUILD_ROLE_CREATE'
	| 'GUILD_ROLE_UPDATE'
	| 'GUILD_ROLE_DELETE'
	| 'INVITE_CREATE'
	| 'INVITE_DELETE'
	| 'MESSAGE_CREATE'
	| 'MESSAGE_UPDATE'
	| 'MESSAGE_DELETE'
	| 'MESSAGE_DELETE_BULK'
	| 'MESSAGE_REACTION_ADD'
	| 'MESSAGE_REACTION_REMOVE'
	| 'MESSAGE_REACTION_REMOVE_ALL'
	| 'MESSAGE_REACTION_REMOVE_EMOJI'
	| 'PRESENCE_UPDATE'
	| 'TYPINGS_START'
	| 'USER_UPDATE'
	| 'VOICE_STATE_UPDATE'
	| 'VOICE_SERVER_UPDATE'
	| 'WEBHOOKS_UPDATE'
	| 'UNKNOWN';

export default class EventPacket extends Packet {
	public event: GatewayEvent;
	public data: any;
	public sequence?: number;

	public static from(p: Payload): EventPacket {
		return new this(p.t, p.d, p.s);
	}

	public constructor(event: GatewayEvent | undefined, data: any, sequence?: number) {
		super(OPCode.DISPATCH);
		this.event = event || 'UNKNOWN';
		this.data = data;
		this.sequence = sequence;
	}

	protected encodeData(): void {
		throw 'Can not encode event packet'
	}
}