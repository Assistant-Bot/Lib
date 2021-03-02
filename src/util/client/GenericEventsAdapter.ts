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
import { EventEmitter, GenericFunction, WrappedFunction } from 'https://deno.land/std@0.85.0/node/events.ts';
import type Interaction from "../../structures/application/Interaction.ts";
import type Channel from "../../structures/channel/Channel.ts";
import type ClientUser from "../../structures/ClientUser.ts";
import type Emoji from "../../structures/guild/Emoji.ts";
import type Guild from "../../structures/guild/Guild.ts";
import type Invite from "../../structures/guild/Invite.ts";
import type Member from "../../structures/guild/Member.ts";
import { RoleData, VoiceState } from "../../net/common/Types.ts";
import EventAdapter, { ClientEvents } from "./EventAdapter.ts";
import Message from "../../structures/Message.ts";
import Presence from "../../structures/guild/Presence.ts";
import TextChannel from "../../structures/guild/TextChannel.ts";
import User from "../../structures/User.ts";
import Role from "../../structures/guild/Role.ts";
import { Payload } from "../../net/ws/packet/Packet.ts";

export default class GenericEventsAdapter extends EventEmitter implements EventAdapter {
	/**
	 * Emitted when the client is connected to discord.
	 */
	public on(event: "ready", listener: (session_id: string, shard: number[] | null, version: number) => any): this;

	/**
	 * Emitted when a channel is created.
	 */
	public on(event: "channelCreate", listener: (channel: Channel) => any): this;

	/**
	 * Emitted when a channel is updated.
	 */
	public on(event: "channelUpdate", listener: (channel: Channel) => any): this;

	/**
	 * Emitted when a channel is deleted.
	 */
	public on(event: "channelDelete", listener: (channel: Channel | string) => any): this;

	/**
	 * Emitted when the guild becomes availiable
	 */
	public on(event: "guildAvailable", listener: (guild: Guild) => any): this;

	/**
	 * Emitted when the guild becomes availiable
	 */
	public on(event: "guildUnavailable", listener: (guild: Guild | Partial<Guild>) => any): this;

	/**
	 * Emitted when a guild is created
	 */
	public on(event: "guildCreate", listener: (guild: Guild) => any): this;

	/**
	 * Emitted when a guild is updated
	 */
	public on(event: "guildUpdate", listener: (guild: Guild) => any): this;

	/**
	 * Emitted when a guild is deleted
	 */
	public on(event: "guildUpdate", listener: (guild: Guild) => any): this;

	/**
	 * Emitted when the client recieves a message.
	 */
	public on(event: "message" | "messageCreate", listener: (message: Message) => any): this;

	/**
	 * Emitted when a message is updated somehow.
	 */
	public on(event: "messageUpdate", listener: (newMessage: Message, oldMessage?: Message) => any): this;

	/**
	 * Emitted when a message is deleted.
	 */
	public on(event: "messageDelete", listener: (message: Partial<Message> | Message) => any): this;

	/**
	 * Emitted when (bulk) messages are deleted
	 */
	public on(event: "messageDeleteBulk", listener: (messages: (Message | string)[]) => any): this;

	/**
	 * Emitted when a reaction is added
	 */
	public on(event: "reactionAdd", listener: (message: Partial<Message> | Message, member: Partial<Member> | Member, emoji: Partial<Emoji> | Emoji) => any): this;

	/**
	 * Emitted when a reaction is removed
	 */
	public on(event: "reactionRemove", listener: (message: Partial<Message> | Message, member: Partial<Member> | Member, emoji: Partial<Emoji> | Emoji) => any): this;

	/**
	 * Emitted when all reactions are removed
	 */
	public on(event: "reactionRemoveAll", listener: (message: Partial<Message> | Message) => any): this;

	/**
	 * Emitted when a specific emoji reaction is removed
	 */
	public on(event: "reactionRemoveEmoji", listener: (message: Partial<Message> | Message, member: Partial<Member> | Member, emoji: Partial<Emoji> | Emoji) => any): this;

	/**
	 * Emitted when a presence is updated
	 */
	public on(event: "presenceUpdate", listener: (presence: Presence) => any): this;

	/**
	 * Emitted when typing starts
	 */
	public on(event: "typingStart", listener: (member: Partial<Member> | Member, channel: TextChannel, timestamp: number) => any): this;

	/**
	 * Emitted when a user is updated
	 */
	public on(event: "userUpdate", listener: (user: User) => any): this;

	/**
	 * Emitted when a user is banned from a guild
	 */
	public on(event: "banAdd", listener: (user: User) => any): this;

	/**
	 * Emitted when a user is unbanned from a guild
	 */
	public on(event: "banRemove", listener: (user: User) => any): this;

	/**
	 * Emitted when emojis in a guild are updated
	 */
	public on(event: "emojisUpdate", listener: (Emojis: Emoji[]) => any): this;

	/**
	 * Emitted when a guild member joins a guild
	 */
	public on(event: "memberJoin", listener: (member: Member, guild: Guild) => any): this;

	/**
	 * Emitted when a member is updated.
	 */
	public on(event: "memberUpdate", listener: (member: Member, guild: Guild) => any): this;

	/**
	 * Emitted when a user leaves a guild or is banned.
	 */
	public on(event: "memberRemove", listener: (user: User | Member, guild: Guild) => any): this;

	/**
	 * Emitted when a role is created
	 */
	public on(event: "roleCreate", listener: (role: Role, guild: Guild) => any): this;

	/**
	 * Emitted when a role is updated
	 */
	public on(event: "roleUpdate", listener: (role: Role, guild: Guild) => any): this;

	/**
	 * Emitted when a role is deleted
	 */
	public on(event: "roleDelete", listener: (role: Role | Partial<RoleData>, guild: Guild) => any): this;

	/**
	 * Emitted when an invite is created
	 */
	public on(event: "inviteCreate", listener: (invite: Invite) => any): this;

	/**
	 * Emitted when an invite is delete
	 */
	public on(event: "inviteDelete", listener: (guildID: string, code: string) => any): this;

	/**
	 * Emitted when voice state is updated
	 */
	public on(event: "voiceStateUpdate", listener: (state: VoiceState) => any): this;

	/**
	 * Emitted when voice region is updated
	 */
	public on(event: "voiceRegionUpdate", listener: (state: { token: string, guild_id: string, endpoint: string }) => any): this;

	/**
	 * Emitted when an interaction is RECIEVED.
	 */
	public on(event: "interactionCreate", listener: (interaction: Interaction) => any): this;

	/**
	 * Emitted when the websocket **manager** recieves a event
	 * @requires ClientOptions.emitPayloads
	 */
	public on(event: "ws", listener: (ev: Payload) => any): this;

	/**
	 * Emitted when the WS recieves or encounters an error.
	 */
	public on(event: "error", listener: (err: any) => any): this;

	public on(event: ClientEvents, listener: GenericFunction | WrappedFunction): this {
		return super.on(event, listener);
	}

	public publish(name: string, ...data: any[]): void {
		super.emit(name, ...data);
	}
}