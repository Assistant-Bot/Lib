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
 * This is private software, you cannot redistribute and/or modify it in any way
 * unless given explicit permission to do so. If you have not been given explicit
 * permission to view or modify this software you should take the appropriate actions
 * to remove this software from your device immediately.
 */
import Client from "../../../Client.ts";
import RuntimeManager from "../../../data/runtime/RuntimeManager.ts";
import AppCommand from "../../../structures/application/AppCommand.ts";
import Interaction from "../../../structures/application/Interaction.ts";
import type GroupChannel from "../../../structures/channel/GroupChannel.ts";
import type DMChannel from "../../../structures/channel/GroupChannel.ts";
import UnknownChannel, { makeChannel } from "../../../structures/channel/UnknownChannel.ts";
import ClientUser from "../../../structures/ClientUser.ts";
import Emoji from "../../../structures/guild/Emoji.ts";
import Guild from "../../../structures/guild/Guild.ts";
import Invite from "../../../structures/guild/Invite.ts";
import Member from "../../../structures/guild/Member.ts";
import type NewsChannel from "../../../structures/guild/NewsChannel.ts";
import Role from "../../../structures/guild/Role.ts";
import type StoreChannel from "../../../structures/guild/StoreChannel.ts";
import type TextChannel from "../../../structures/guild/TextChannel.ts";
import type VoiceChannel from "../../../structures/guild/VoiceChannel.ts";
import Message from "../../../structures/Message.ts";
import User from "../../../structures/User.ts";
import { GuildData, InviteData, InviteMetadata, RoleData } from "../../common/Types.ts";
import { Connector } from "../Connector.ts";
import EventPacket from "../packet/EventPacket.ts";
import { Payload } from "../packet/Packet.ts";

export default class Generic extends Connector {
	public sequence: number = 0;
	#deadGuilds: Set<string> = new Set<string>();
	#client: Client;

	public constructor(client: Client, gateway: string) {
		super(gateway);
		this.#client = client;

		if (client.shardMode !== 'Nodes') {
			throw new Error('Generic connector does not support any mode other than "Nodes"');
		}

		if (!client.dataManager) {
			client.dataManager = new RuntimeManager();
		}
	}

	public async wsPacket(payload: Payload): Promise<void> {
		const packet: EventPacket = EventPacket.from(payload);

		if (this.#client.options.connection.emitPayloads) {
			this.#client.emit('ws', payload);
		}

		if (packet.event === "READY") {
			this.#client.user = new ClientUser(this.#client, packet.data.user);
			this.#client.emit('ready', packet.data.session_id);

			for (let guild of packet.data.guilds) {
				if (guild.unavailable === true) {
					this.#deadGuilds.add(guild.id);
				} else {
					this.wsPacket({
						t: "GUILD_CREATE",
						s: -1,
						op: 0,
						d: guild
					});
				}
			}
		}

		if (packet.event === "CHANNEL_CREATE") {
			const channel: TextChannel | DMChannel | GroupChannel | NewsChannel | StoreChannel | VoiceChannel | UnknownChannel = makeChannel(this.#client, packet.data);
			this.#client.dataManager?.channels.set(packet.data.id, channel)
			this.#client.emit('channelCreate', channel);
		}

		if (packet.event === "CHANNEL_UPDATE") {
			const channel: TextChannel | DMChannel | GroupChannel | NewsChannel | StoreChannel | VoiceChannel | UnknownChannel = makeChannel(this.#client, packet.data);
			this.#client.dataManager?.channels.set(packet.data.id, channel)
			this.#client.emit('channelUpdate', channel);
		}

		if (packet.event === "CHANNEL_DELETE") {
			const channel: TextChannel | DMChannel | GroupChannel | NewsChannel | StoreChannel | VoiceChannel | UnknownChannel = this.#client.dataManager?.channels.get(packet.data);
			this.#client.dataManager?.channels.delete(packet.data.id);
			this.#client.emit('channelDelete', channel);
		}

		if (packet.event === "CHANNEL_PINS_UPDATE") {
			const channel: TextChannel = this.#client.dataManager?.channels.get(packet.data.channel_id);
			if(!channel) {
				this.#client.emit('pinUpdate', packet.data); // in case they really need this event.
				return;
			}
			channel.lastPinTimestamp = Date.parse(packet.data.last_pin_timestamp);
			this.#client.emit('pinUpdate', channel, channel.lastPinTimestamp);
		}

		if (packet.event === 'GUILD_CREATE') {
			if (packet.data.unavailable) {
				if (this.#client.dataManager?.guilds.has(packet.data.id)) {
					this.#client.dataManager.guilds.get(packet.data.id).unavailable = true;
				} else {
					this.#deadGuilds.add(packet.data.id);
				}
			} else {
				if (this.#deadGuilds.has(packet.data.id)) {
					this.#deadGuilds.delete(packet.data.id);
					// available
					const guild: Guild = new Guild(this.#client, packet.data);
					this.#client.emit('guildAvailable', guild);
				} else {
					const guild: Guild = new Guild(this.#client, packet.data);
					this.#client.emit('guildCreate', guild);
				}
			}
		}

		if (packet.event === "GUILD_UPDATE") {
			// todo: Refactor how updates are handled.
			const guild: Guild = this.#client.dataManager?.guilds.update(new Guild(this.#client, packet.data));
			this.#client.emit('guildUpdate', guild);
		}

		if (packet.event === "GUILD_DELETE") {
			if (packet.data.unavailable === true) {
				const guild: Guild = this.#client.dataManager?.guilds.get(packet.data) || new Guild(this.#client, packet.data);
				guild.unavailable = true;
				this.#client.emit('guildUnavailable', guild);
			} else {
				const guildOrPart: Guild | Partial<GuildData> = this.#client.dataManager?.guilds.get(packet.data) || packet.data;
				this.#client.dataManager?.guilds.delete(packet.data.id);
				this.#client.emit('guildDelete', guildOrPart);
			}
		}

		if (packet.event === 'MESSAGE_CREATE') {
			const m: Message = new Message(this.#client, packet.data);
			this.#client.dataManager?.messages.set(m.id, m);
			this.#client.dataManager?.users.set(m.author.id, m.author);
			this.#client.emit('messageCreate', m);
			this.#client.emit('message', m);
		}

		if (packet.event === 'MESSAGE_UPDATE') {
			const m = this.#client.dataManager?.messages.get(packet.data.id) || new Message(this.#client, packet.data);
			const cached = Object.assign({}, m);
			m.update(packet.data);
			this.#client.emit('messageUpdate', m, cached || null);
		}

		if(packet.event === 'MESSAGE_DELETE') {
			const m: Message = this.#client.dataManager?.messages.get(packet.data.id);
			this.#client.dataManager?.messages.delete(packet.data.id)
			this.#client.emit('messageDelete', m)
		}

		if(packet.event === 'MESSAGE_DELETE_BULK') {
			const m: (Message | string)[] = packet.data.ids.map((id: string) => this.#client.dataManager?.messages.get(id) || id);
			packet.data.ids.map((id: string) => this.#client.dataManager?.messages.delete(id));
			this.#client.emit('messageDeleteBulk', m); // idk if you'll like this john :^|
		}

		if (packet.event === "GUILD_BAN_ADD") {
			// we're making an object here because we dont need to fetch from the datastore.
			const user: User = new User(this.#client, packet.data);
			this.#client.emit('banAdd', user, packet.data.guild_id);
		}

		if (packet.event === "GUILD_BAN_REMOVE") {
			const user: User = new User(this.#client, packet.data);
			this.#client.emit('banRemove', user, packet.data.guild_id);
		}

		if (packet.event === "GUILD_EMOJIS_UPDATE") {
			const guild: Guild = this.#client.dataManager?.guilds.get(packet.data.guild_id);
			const updated: Emoji[] = [];
			let emoji: Emoji;
			for (emoji of packet.data.emojis) {
				guild.emojis.set(emoji.id, new Emoji(this.#client, emoji));
				updated.push(new Emoji(this.#client, emoji));
			}
			this.#client.dataManager?.guilds.update(guild);
			this.#client.emit('emojisUpdate', updated);
		}

		if (packet.event === "GUILD_INTEGRATIONS_UPDATE") {
			// wtf
			const guild: Guild = this.#client.dataManager?.guilds.get(packet.data.guild_id);
			this.#client.emit('integrationsUpdate', guild);
		}

		if (packet.event === "GUILD_MEMBER_ADD") {
			const guild: Guild = this.#client.dataManager?.guilds.get(packet.data.guild_id);
			const member: Member = new Member(this.#client, packet.data);
			guild.members.set(packet.data.id, member);
			this.#client.emit('memberJoin', member, guild);
		}

		if (packet.event === "GUILD_MEMBER_UPDATE") {
			const guild: Guild = this.#client.dataManager?.guilds.get(packet.data.guild_id);
			const member: Member | undefined = guild.members.get(packet.data.user.id);

			this.#client.emit('memberUpdate', member || new Member(this.#client, packet.data), guild);
		}

		if (packet.event === "GUILD_MEMBER_REMOVE") {
			const guild: Guild = this.#client.dataManager?.guilds.get(packet.data.guild_id);
			const member: Member | User = guild.members.get(packet.data.user.id) || new User(this.#client, packet.data);
			guild.members.delete(packet.data.user.id);
			this.#client.emit('memberRemove', member, guild);
		}

		if (packet.event === "GUILD_MEMBER_CHUNK") {
			if (packet.data.not_found) {
				return;
			}
			const guild: Guild = this.#client.dataManager?.guilds.get(packet.data.guild_id);
			// to do: Presences
			for (let member of packet.data.members) {
				guild.members.set(member.user.id, new Member(this.#client, member.user.id));
			}
		}

		if (packet.event === "GUILD_ROLE_CREATE") {
			const guild: Guild = this.#client.dataManager?.guilds.get(packet.data.guild_id) || { id: packet.data.guild_id };
			const role: Role = new Role(this.#client, packet.data.role);
			guild.roles.set(packet.data.role.id, role);
			this.#client.emit('roleCreate', role, guild);
		}

		if (packet.event === "GUILD_ROLE_UPDATE") {
			const guild: Guild = this.#client.dataManager?.guilds.get(packet.data.guild_id) || { id: packet.data.guild_id };
			const role: Role = guild.roles.get(packet.data.role.id) || new Role(this.#client, packet.data.role);
			role.update(Object.assign(role, packet.data));
			this.#client.emit('roleUpdate', role, guild);
		}

		if (packet.event === "GUILD_ROLE_DELETE") {
			const guild: Guild = this.#client.dataManager?.guilds.get(packet.data.guild_id) || { id: packet.data.guild_id };
			const role: Role | Partial<RoleData> = guild.roles.get(packet.data.role_id) || { id: packet.data.role_id };
			guild.roles.delete(role.id as string);
			this.#client.emit('roleDelete', role, guild);
		}

		if (packet.event === 'INVITE_CREATE') {
			this.#client.emit('inviteCreate', new Invite(this.#client, packet.data as InviteData))
		}

		if (packet.event === 'INVITE_DELETE') {
			const guild: Guild = this.#client.dataManager?.guilds.get(packet.data.guild_id) || { id: packet.data.guild_id };
			this.#client.emit('inviteDelete', guild, packet.data.code);
		}

		if (packet.event === "INTERACTION_CREATE") {
			const interaction: Interaction = new Interaction(this.#client, packet.data);
			this.#client.emit('interactionCreate', interaction);
		}
	}

	public async wsError(ev: Event | ErrorEvent): Promise<void> {
		console.error(ev);
	}
}