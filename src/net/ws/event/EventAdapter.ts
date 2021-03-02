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
import Interaction from "../../../structures/application/Interaction.ts";
import DMChannel from "../../../structures/channel/DMChannel.ts";
import GroupChannel from "../../../structures/channel/GroupChannel.ts";
import UnknownChannel,{ makeChannel } from "../../../structures/channel/UnknownChannel.ts";
import ClientUser from "../../../structures/ClientUser.ts";
import Emoji from "../../../structures/guild/Emoji.ts";
import Guild from "../../../structures/guild/Guild.ts";
import Invite from "../../../structures/guild/Invite.ts";
import Member from "../../../structures/guild/Member.ts";
import NewsChannel from "../../../structures/guild/NewsChannel.ts";
import Presence from "../../../structures/guild/Presence.ts";
import Role from "../../../structures/guild/Role.ts";
import StoreChannel from "../../../structures/guild/StoreChannel.ts";
import TextChannel from "../../../structures/guild/TextChannel.ts";
import VoiceChannel from "../../../structures/guild/VoiceChannel.ts";
import Message from "../../../structures/Message.ts";
import User from "../../../structures/User.ts";
import type { GuildData,RoleData,VoiceState } from "../../common/Types.ts";
import EventPacket from "../packet/EventPacket.ts";
import { Payload } from "../packet/Packet.ts";
import CEventAdapter from "../../../util/client/EventAdapter.ts";

export interface IEventAdapter {
	wsPacket?: (client: Client, payload: Payload) => any;
	handleEvent: (client: Client, payload: Payload) => any;
}

export default class EventAdapter implements IEventAdapter {
	protected deadGuilds: Set<string> = new Set();

	public async handleEvent(client: Client<CEventAdapter>, payload: Payload) {
		const packet: EventPacket = EventPacket.from(payload);

		if (client.options.connection.emitPayloads) {
			client.events.publish('ws', payload);
		}

		if(packet.event === 'RESUMED') {
			client.events.publish('resume');
		}

		if(packet.event === 'INTERACTION_CREATE') {
			const i = new Interaction(client, packet.data);
			client.events.publish('interactionCreate', i);
		}

		if (packet.event === "CHANNEL_CREATE") {
			const channel: TextChannel | DMChannel | GroupChannel | NewsChannel | StoreChannel | VoiceChannel | UnknownChannel = makeChannel(client, packet.data);
			client.dataManager?.channels.set(packet.data.id, channel)
			client.events.publish('channelCreate', channel);
		}

		if (packet.event === "CHANNEL_UPDATE") {
			const channel: TextChannel | DMChannel | GroupChannel | NewsChannel | StoreChannel | VoiceChannel | UnknownChannel = makeChannel(client, packet.data);
			client.dataManager?.channels.set(packet.data.id, channel)
			client.events.publish('channelUpdate', channel);
		}

		if (packet.event === "CHANNEL_DELETE") {
			const channel: TextChannel | DMChannel | GroupChannel | NewsChannel | StoreChannel | VoiceChannel | UnknownChannel = client.dataManager?.channels.get(packet.data);
			client.dataManager?.channels.delete(packet.data.id);
			client.events.publish('channelDelete', channel);
		}

		if (packet.event === "CHANNEL_PINS_UPDATE") {
			const channel: TextChannel = client.dataManager?.channels.get(packet.data.channel_id)
			if(!channel) return // ???
			channel.lastPinTimestamp = Date.parse(packet.data.last_pin_timestamp);
			client.events.publish('pinUpdate', channel, channel.lastPinTimestamp)
		}

		if (packet.event === 'GUILD_CREATE') {
			if (packet.data.unavailable) {
				if (client.dataManager?.guilds.has(packet.data.id)) {
					client.dataManager.guilds.get(packet.data.id).unavailable = true;
				} else {
					this.deadGuilds.add(packet.data.id);
				}
			} else {
				if (this.deadGuilds.has(packet.data.id)) {
					this.deadGuilds.delete(packet.data.id);
					// available
					const guild: Guild = new Guild(client, packet.data);
					client.events.publish('guildAvailable', guild);
				} else {
					const guild: Guild = new Guild(client, packet.data);
					client.events.publish('guildCreate', guild);
				}
			}
		}

		if (packet.event === "GUILD_UPDATE") {
			// todo: Refactor how updates are handled.
			const guild: Guild = client.dataManager?.guilds.update(new Guild(client, packet.data));
			client.events.publish('guildUpdate', guild);
		}

		if (packet.event === "GUILD_DELETE") {
			if (packet.data.unavailable === true) {
				const guild: Guild = client.dataManager?.guilds.get(packet.data) || new Guild(client, packet.data);
				guild.unavailable = true;
				client.events.publish('guildUnavailable', guild);
			} else {
				const guildOrPart: Guild | Partial<GuildData> = client.dataManager?.guilds.get(packet.data) || packet.data;
				client.dataManager?.guilds.delete(packet.data.id);
				client.events.publish('guildDelete', guildOrPart);
			}
		}

		if (packet.event === 'MESSAGE_CREATE') {
			const m: Message = new Message(client, packet.data);
			client.dataManager?.messages.set(m.id, m);
			client.dataManager?.users.set(m.author.id, m.author);
			client.events.publish('messageCreate', m);
			client.events.publish('message', m);
		}

		if (packet.event === 'MESSAGE_UPDATE') {
			const m: Message | Partial<Message> = new Message(client, packet.data);
			const cached = client.dataManager?.messages.get(m.id || '0');
			client.dataManager?.messages.set(m.id || '0', m);
			client.dataManager?.users.set(m.author?.id || '0', m.author);
			client.events.publish('messageUpdate', m, cached || null);
		}

		if(packet.event === 'MESSAGE_DELETE') {
			const m: Message = client.dataManager?.messages.get(packet.data.id);
			client.dataManager?.messages.delete(packet.data.id)
			client.events.publish('messageDelete', m)
		}

		if(packet.event === 'MESSAGE_DELETE_BULK') {
			const m: (Message | string)[] = packet.data.ids.map((id: string) => client.dataManager?.messages.get(id) || id);
			packet.data.ids.map((id: string) => client.dataManager?.messages.delete(id));
			client.events.publish('messageDeleteBulk', m); // idk if you'll like this john :^|
		}

		if(packet.event === 'MESSAGE_REACTION_ADD') {
			/**
			const m: Message = client.dataManager?.messages.get(packet.data.message_id);
			const mm: Member = client.dataManager?.guilds.get(packet.data.guild_id).members.get(packet.data.user_id);
			const e: Partial<Emoji> = new Emoji(client, packet.data.emoji)
			let count: number = m.reactions?.find(e => e.emoji === e)?.count ?? 0

			if(m && m.reactions) {
				m?.reactions.push({count: count++, emoji: e, me: mm.id === client.user.id })
			} else {
				m!.reactions = [];
				m?.reactions.push({count: count++, emoji: e, me: mm.id === client.user.id })
			}
			client.events.publish('reactionAdd', m, mm, e);
			**/
		}

		if(packet.event === 'MESSAGE_REACTION_REMOVE') {
			if (!packet.data.member) { return };
			//const m: Message = client.dataManager?.messages.get(packet.data.message_id);
			//const mm: Member = client.dataManager?.guilds.get(packet.data.guild_id).members.get(packet.data.member?.id);
			//const e: Partial<Emoji> = new Emoji(client, packet.data)
			//client.events.publish('reactionRemove', m, mm, e);
		}

		if(packet.event === 'MESSAGE_REACTION_REMOVE_ALL') {
			//const m: Message = client.dataManager?.messages.get(packet.data.message_id);
			//client.events.publish('reactionRemoveAll', m);
		}

		if(packet.event === 'MESSAGE_REACTION_REMOVE_EMOJI') {
			//const m: Message = client.dataManager?.messages.get(packet.data.message_id);
			//const mm: Member = client.dataManager?.guilds.get(packet.data.guild_id).members.get(packet.data.member.id);
			//const e: Partial<Emoji> = new Emoji(client, packet.data)
			//client.events.publish('reactionRemoveEmoji', m, mm, e);
		}

		if(packet.event === 'PRESENCE_UPDATE') {
			const p: Presence = new Presence(packet.data);
			client.events.publish('presenceUpdate', p);
		}

		if(packet.event === 'TYPINGS_START') {
			const ch: TextChannel = client.dataManager?.channels.get(packet.data.channel_id);
			packet.data.guild_id = ch.guild.id;
			const m: Member = new Member(client, packet.data.member);
			client.events.publish('typingStart', m, ch, packet.data.timestamp as number)
		}

		if(packet.event === 'USER_UPDATE') {
			const user: User = new User(client, packet.data); // Should we fetch???
			client.events.publish('userUpdate', user);
		}

		if (packet.event === "GUILD_BAN_ADD") {
			// we're making an object here because we dont need to fetch from the datastore.
			const user: User = new User(client, packet.data);
			client.events.publish('banAdd', user, packet.data.guild_id);
		}

		if (packet.event === "GUILD_BAN_REMOVE") {
			const user: User = new User(client, packet.data);
			client.events.publish('banRemove', user, packet.data.guild_id);
		}

		if (packet.event === "GUILD_EMOJIS_UPDATE") {
			const guild: Guild = client.dataManager?.guilds.get(packet.data.guild_id);
			const updated: Emoji[] = [];
			let emoji: Emoji;
			for (emoji of packet.data.emojis) {
				guild.emojis.set(emoji.id, new Emoji(client, emoji));
				updated.push(new Emoji(client, emoji));
			}
			client.dataManager?.guilds.update(guild);
			client.events.publish('emojisUpdate', updated);
		}

		if (packet.event === "GUILD_INTEGRATIONS_UPDATE") {
			// wtf
			const guild: Guild = client.dataManager?.guilds.get(packet.data.guild_id);
			client.events.publish('integrationsUpdate', guild);
		}

		if (packet.event === "GUILD_MEMBER_ADD") {
			const guild: Guild = client.dataManager?.guilds.get(packet.data.guild_id);
			packet.data.guild_id = guild.id
			const member: Member = new Member(client, packet.data);
			guild.members.set(packet.data.id, member);
			client.events.publish('memberJoin', member, guild);
		}

		if (packet.event === "GUILD_MEMBER_UPDATE") {
			const guild: Guild = client.dataManager?.guilds.get(packet.data.guild_id);
			const member: Member | undefined = guild?.members.get(packet.data.user.id);
			packet.data.guild_id = guild.id;

			client.events.publish('memberUpdate', member || new Member(client, packet.data), guild);
		}

		if (packet.event === "GUILD_MEMBER_REMOVE") {
			const guild: Guild = client.dataManager?.guilds.get(packet.data.guild_id);
			const member: Member | User = guild.members.get(packet.data.user.id) || new User(client, packet.data);
			guild.members.delete(packet.data.user.id);
			client.events.publish('memberRemove', member, guild);
		}

		if (packet.event === "GUILD_MEMBER_CHUNK") {
			if (packet.data.not_found) {
				return;
			}
			const guild: Guild = client.dataManager?.guilds.get(packet.data.guild_id);
			// to do: Presences
			for (let member of packet.data.members) {
				guild.members.set(member.user.id, new Member(client, member.user.id));
			}
		}

		if (packet.event === "GUILD_ROLE_CREATE") {
			const guild: Guild = client.dataManager?.guilds.get(packet.data.guild_id);
			packet.data.role.guild_id = packet.data.guild_id;
			const role: Role = new Role(client, packet.data.role);
			guild.roles.set(packet.data.role.id, role);
			client.events.publish('roleCreate', role, guild);
		}

		if (packet.event === "GUILD_ROLE_UPDATE") {
			const guild: Guild = client.dataManager?.guilds.get(packet.data.guild_id);
			packet.data.role.guild_id = packet.data.guild_id;
			const role: Role = guild.roles.get(packet.data.role.id) || new Role(client, packet.data.role);
			role.update(Object.assign(role, packet.data));
			client.events.publish('roleUpdate', role, guild);
		}

		if (packet.event === "GUILD_ROLE_DELETE") {
			const guild: Guild = client.dataManager?.guilds.get(packet.data.guild_id);
			const role: Role | Partial<RoleData> = guild.roles.get(packet.data.role_id) || { id: packet.data.role_id };
			guild.roles.delete(role.id as string);
			client.events.publish('roleDelete', role, guild);
		}

		if(packet.event === 'INVITE_CREATE') {
			client.events.publish('inviteCreate', new Invite(client, packet.data));
		}

		if(packet.event === 'INVITE_DELETE') {
			client.events.publish('inviteDelete', packet.data.guild_id, packet.data.code);
		}

		if(packet.event === 'VOICE_STATE_UPDATE') {
			const v: VoiceState = packet.data;
			client.events.publish('voiceStateUpdate', v);
		}

		if(packet.event === 'VOICE_SERVER_UPDATE') {
 			const v: {token: string, guild_id: string, endpoint: string} = packet.data;
			client.events.publish('voiceRegionUpdate', v);
		}

		if(packet.event === "WEBHOOKS_UPDATE") {
			const w: {guild_id: string, channel_id: string} = packet.data;
			client.events.publish('webhookUpdate', w);
		}
	}
}