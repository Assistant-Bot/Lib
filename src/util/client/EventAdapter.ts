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

/**
 * Events emitted when recieved from the websocket,
 * you should enforce these. However you are not required to.
 */
export type ClientEvents =
	| "ws"
	| "error"
	| "unknown"
	| "ready"
	| "resume"
	| "reconnect"
	| "disconnect"
	| "channelCreate"
	| "channelUpdate"
	| "channelDelete"
	| "interactionCreate"
	| "pinUpdate"
	| "guildAvailable"
	| "guildUnavailable"
	| "guildCreate"
	| "guildUpdate"
	| "guildDelete"
	| "banAdd"
	| "banRemove"
	| "emojisUpdate"
	| "integrationsUpdate"
	| "memberJoin"
	| "memberRemove"
	| "memberUpdate"
	| "membersChunk"
	| "roleCreate"
	| "roleUpdate"
	| "roleDelete"
	| "inviteCreate"
	| "inviteDelete"
	| "message"
	| "messageCreate"
	| "messageUpdate"
	| "messageDelete"
	| "messageDeleteBulk"
	| "reactionAdd"
	| "reactionUpdate"
	| "reactionRemove"
	| "reactionRemoveAll"
	| "reactionRemoveEmoji"
	| "presenceUpdate"
	| "typingStart"
	| "userUpdate"
	| "voiceStateUpdate"
	| "voiceRegionUpdate"
	| "webhookUpdate";
/**
 * An interface that interacts with the user api
 */
export default interface EventAdapter {
	/**
	 * Assistant expects the api to be used like node's event emitter: `EventEmitter.emit('channel', ...data)`.
	 * Assistant will then proceed to use this function to "emit" or "broadcast" events.
	 * It is your job to "broadcast" these events to your api/interface.
	 *
	 * Usage:
	 *
	 *     class CustomAdapter extends EventAdapter {
	 *       public listeners: Map<string, Function[]> = new Map();
	 *       public publish(name: string, ...data: any[]): void {
	 * 		  this.listeners.get(name)?.(...data);
	 *       }
	 *     }
	 */
	publish(name: string, ...data: any[]): any;
}