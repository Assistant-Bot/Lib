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
export type PermissionTypes =
	| "createInvite"
	| "kickMembers"
	| "banMembers"
	| "administrator"
	| "modifyChannels"
	| "modifyGuild"
	| "addReactions"
	| "viewAuditLog"
	| "prioritySpeaker"
	| "stream"
	| "viewChannel"
	| "sendMessages"
	| "TTS"
	| "manageMessages"
	| "embedLinks"
	| "attachFiles"
	| "readMessageHistory"
	| "mentionEveryone"
	| "externalEmojis"
	| "viewInsights"
	| "connect"
	| "speak"
	| "muteMembers"
	| "deafenMembers"
	| "moveMembers"
	| "useVoiceActivity"
	| "changeNickname"
	| "modifyNicknames"
	| "modifyRoles"
	| "modifyWebhooks"
	| "modifyEmojis";

export enum PermissionBits {
	CREATE_INSTANT_INVITE = 1 << 0,
	KICK_MEMBERS = 1 << 1,
	BAN_MEMBERS = 1 << 2,
	ADMINISTRATOR = 1 << 3,
	MANAGE_CHANNELS = 1 << 4,
	MANAGE_GUILD = 1 << 5,
	ADD_REACTIONS = 1 << 6,
	VIEW_AUDIT_LOG = 1 << 7,
	PRIORITY_SPEAKER = 1 << 8,
	STREAM = 1 << 9,
	VIEW_CHANNEL = 1 << 10,
	SEND_MESSAGES = 1 << 11,
	SEND_TTS_MESSAGES = 1 << 12,
	MANAGE_MESSAGES = 1 << 13,
	EMBED_LINKS = 1 << 14,
	ATTACH_FILES = 1 << 15,
	READ_MESSAGE_HISTORY = 1 << 16,
	MENTION_EVERYONE = 1 << 17,
	USE_EXTERNAL_EMOJIS = 1 << 18,
	VIEW_GUILD_INSIGHTS = 1 << 19,
	CONNECT = 1 << 20,
	SPEAK = 1 << 21,
	MUTE_MEMBERS = 1 << 22,
	DEAFEN_MEMBERS = 1 << 23,
	MOVE_MEMBERS = 1 << 24,
	USE_VAD = 1 << 25,
	CHANGE_NICKNAME = 1 << 26,
	MANAGE_NICKNAMES = 1 << 27,
	MANAGE_ROLES = 1 << 28,
	MANAGE_WEBHOOKS = 1 << 29,
	MANAGE_EMOJIS = 1 << 30
}

export default class Permission {
	private current: PermissionTypes[];

	public constructor(perms: PermissionTypes[] = []) {
		this.current = perms;
	}

	public static from(bits: number): Permission {
		let current: PermissionTypes[] = [];
		if ((bits & PermissionBits.CREATE_INSTANT_INVITE) === PermissionBits.CREATE_INSTANT_INVITE) current.push('createInvite');
		if ((bits & PermissionBits.KICK_MEMBERS) === PermissionBits.KICK_MEMBERS) current.push('kickMembers');
		if ((bits & PermissionBits.BAN_MEMBERS) === PermissionBits.BAN_MEMBERS) current.push('banMembers');
		if ((bits & PermissionBits.ADMINISTRATOR) === PermissionBits.ADMINISTRATOR) current.push('administrator');
		if ((bits & PermissionBits.MANAGE_CHANNELS) === PermissionBits.MANAGE_CHANNELS) current.push('modifyChannels');
		if ((bits & PermissionBits.MANAGE_GUILD) === PermissionBits.MANAGE_GUILD) current.push('modifyGuild');
		if ((bits & PermissionBits.ADD_REACTIONS) === PermissionBits.ADD_REACTIONS) current.push('addReactions');
		if ((bits & PermissionBits.VIEW_AUDIT_LOG) === PermissionBits.VIEW_AUDIT_LOG) current.push('viewAuditLog');
		if ((bits & PermissionBits.PRIORITY_SPEAKER) === PermissionBits.PRIORITY_SPEAKER) current.push('prioritySpeaker');
		if ((bits & PermissionBits.STREAM) === PermissionBits.STREAM) current.push('stream');
		if ((bits & PermissionBits.VIEW_CHANNEL) === PermissionBits.VIEW_CHANNEL) current.push('viewChannel');
		if ((bits & PermissionBits.SEND_MESSAGES) === PermissionBits.SEND_MESSAGES) current.push('sendMessages');
		if ((bits & PermissionBits.SEND_TTS_MESSAGES) === PermissionBits.SEND_TTS_MESSAGES) current.push('TTS');
		if ((bits & PermissionBits.MANAGE_MESSAGES) === PermissionBits.MANAGE_MESSAGES) current.push('manageMessages');
		if ((bits & PermissionBits.EMBED_LINKS) === PermissionBits.EMBED_LINKS) current.push('embedLinks');
		if ((bits & PermissionBits.ATTACH_FILES) === PermissionBits.ATTACH_FILES) current.push('attachFiles');
		if ((bits & PermissionBits.READ_MESSAGE_HISTORY) === PermissionBits.READ_MESSAGE_HISTORY) current.push('readMessageHistory');
		if ((bits & PermissionBits.MENTION_EVERYONE) === PermissionBits.MENTION_EVERYONE) current.push('mentionEveryone');
		if ((bits & PermissionBits.USE_EXTERNAL_EMOJIS) === PermissionBits.USE_EXTERNAL_EMOJIS) current.push('externalEmojis');
		if ((bits & PermissionBits.VIEW_GUILD_INSIGHTS) === PermissionBits.VIEW_GUILD_INSIGHTS) current.push('viewInsights');
		if ((bits & PermissionBits.CONNECT) === PermissionBits.CONNECT) current.push('connect');
		if ((bits & PermissionBits.SPEAK) === PermissionBits.SPEAK) current.push('speak');
		if ((bits & PermissionBits.DEAFEN_MEMBERS) === PermissionBits.DEAFEN_MEMBERS) current.push('deafenMembers');
		if ((bits & PermissionBits.MOVE_MEMBERS) === PermissionBits.MOVE_MEMBERS) current.push('moveMembers');
		if ((bits & PermissionBits.USE_VAD) === PermissionBits.USE_VAD) current.push('useVoiceActivity');
		if ((bits & PermissionBits.CHANGE_NICKNAME) === PermissionBits.CHANGE_NICKNAME) current.push('changeNickname');
		if ((bits & PermissionBits.MANAGE_NICKNAMES) === PermissionBits.MANAGE_NICKNAMES) current.push('modifyNicknames');
		if ((bits & PermissionBits.MANAGE_ROLES) === PermissionBits.MANAGE_ROLES) current.push('modifyRoles');
		if ((bits & PermissionBits.MANAGE_WEBHOOKS) === PermissionBits.MANAGE_WEBHOOKS) current.push('modifyWebhooks');
		return new Permission(current);
	}

	public parse(): PermissionBits {
		let current: number = 0;

		for (let perm of this.current) {
			switch (perm) {
				case 'createInvite':
					current |= PermissionBits.CREATE_INSTANT_INVITE;
					break;
				case 'kickMembers':
					current |= PermissionBits.KICK_MEMBERS;
					break;
				case 'banMembers':
					current |= PermissionBits.BAN_MEMBERS;
					break;
				case 'administrator':
					current |= PermissionBits.ADMINISTRATOR;
					break;
				case 'modifyChannels':
					current |= PermissionBits.MANAGE_CHANNELS;
					break;
				case 'modifyGuild':
					current |= PermissionBits.MANAGE_GUILD;
					break;
				case 'addReactions':
					current |= PermissionBits.ADD_REACTIONS;
					break;
				case 'viewAuditLog':
					current |= PermissionBits.VIEW_AUDIT_LOG;
					break;
				case 'prioritySpeaker':
					current |= PermissionBits.PRIORITY_SPEAKER;
					break;
				case 'stream':
					current |= PermissionBits.STREAM;
					break;
				case 'viewChannel':
					current |= PermissionBits.VIEW_CHANNEL;
					break;
				case 'sendMessages':
					current |= PermissionBits.SEND_MESSAGES;
					break;
				case 'TTS':
					current |= PermissionBits.SEND_TTS_MESSAGES;
					break;
				case 'manageMessages':
					current |= PermissionBits.MANAGE_MESSAGES;
					break;
				case 'embedLinks':
					current |= PermissionBits.EMBED_LINKS;
					break;
				case 'attachFiles':
					current |= PermissionBits.ATTACH_FILES;
					break;
				case 'readMessageHistory':
					current |= PermissionBits.READ_MESSAGE_HISTORY;
					break;
				case "mentionEveryone":
					current |= PermissionBits.MENTION_EVERYONE;
					break;
				case 'externalEmojis':
					current |= PermissionBits.USE_EXTERNAL_EMOJIS;
					break;
				case 'viewInsights':
					current |= PermissionBits.VIEW_GUILD_INSIGHTS;
					break;
				case 'connect':
					current |= PermissionBits.CONNECT;
					break;
				case 'speak':
					current |= PermissionBits.SPEAK;
					break;
				case 'deafenMembers':
					current |= PermissionBits.DEAFEN_MEMBERS;
					break;
				case 'moveMembers':
					current |= PermissionBits.MOVE_MEMBERS;
					break;
				case 'useVoiceActivity':
					current |= PermissionBits.USE_VAD;
					break;
				case 'changeNickname':
					current |= PermissionBits.CHANGE_NICKNAME;
					break;
				case 'modifyNicknames':
					current |= PermissionBits.MANAGE_NICKNAMES;
					break;
				case 'modifyRoles':
					current |= PermissionBits.MANAGE_ROLES;
					break;
				case 'modifyWebhooks':
					current |= PermissionBits.MANAGE_WEBHOOKS;
					break;
			}
		}
		return current;
	}

	public has(bitOrName: PermissionTypes | PermissionBits): boolean {
		if (typeof bitOrName === 'string') {
			return this.current.includes(bitOrName);
		} else {
			return (this.parse() & bitOrName) === bitOrName;
		}
	}

	public get allow(): Permission {
		return Permission.from(this.parse());
	}

	public get deny(): Permission {
		let perm = 0;
		(Object.values(PermissionBits) as PermissionBits[]).map(bit => {
			if ((bit & (this.allow.parse() as number)) !== (bit as number)) {
				perm |= bit
			}
		});
		return Permission.from(perm);
	}
}