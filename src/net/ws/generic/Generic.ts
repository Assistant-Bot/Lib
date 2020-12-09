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
import Channel from "../../../structures/channel/Channel.ts";
import type GroupChannel from "../../../structures/channel/GroupChannel.ts";
import type DMChannel from "../../../structures/channel/GroupChannel.ts";
import type UnknownChannel from "../../../structures/channel/UnknownChannel.ts";
import ClientUser from "../../../structures/ClientUser.ts";
import Guild from "../../../structures/guild/Guild.ts";
import type NewsChannel from "../../../structures/guild/NewsChannel.ts";
import type StoreChannel from "../../../structures/guild/StoreChannel.ts";
import type TextChannel from "../../../structures/guild/TextChannel.ts";
import type VoiceChannel from "../../../structures/guild/VoiceChannel.ts";
import Message from "../../../structures/Message.ts";
import { GuildData } from "../../common/Types.ts";
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
			this.#client.emit('ready');

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
			const channel: TextChannel | DMChannel | GroupChannel | NewsChannel | StoreChannel | VoiceChannel | UnknownChannel = Channel.from(this.#client, packet.data);
			this.#client.dataManager?.channels.set(packet.data.id, channel)
			this.#client.emit('channelCreate', channel);
		}

		if (packet.event === "CHANNEL_UPDATE") {
			const channel: TextChannel | DMChannel | GroupChannel | NewsChannel | StoreChannel | VoiceChannel | UnknownChannel = Channel.from(this.#client, packet.data);
			this.#client.dataManager?.channels.set(packet.data.id, channel)
			this.#client.emit('channelUpdate', channel);
		}

		if (packet.event === "CHANNEL_DELETE") {
			const channel: TextChannel | DMChannel | GroupChannel | NewsChannel | StoreChannel | VoiceChannel | UnknownChannel = this.#client.dataManager?.channels.get(packet.data);
			this.#client.dataManager?.channels.delete(packet.data.id);
			this.#client.emit('channelDelete', channel);
		}

		if (packet.event === "CHANNEL_PINS_UPDATE") {
			// todo
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
			const m: Message = new Message(this.#client, packet.data);
			const cached = this.#client.dataManager?.messages.get(m.id);
			this.#client.dataManager?.messages.set(m.id, m);
			this.#client.dataManager?.users.set(m.author.id, m.author);
			this.#client.emit('messageUpdate', m, cached || null);
		}
	}

	public async wsError(ev: Event | ErrorEvent): Promise<void> {
		console.error(ev);
	}
}