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
import RuntimeStore from "../../../data/RuntimeStore.ts";
import ClientUser from "../../../structures/ClientUser.ts";
import Guild from "../../../structures/guild/Guild.ts";
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

		if (!client.dataStore) {
			client.dataStore = new RuntimeStore();
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

		// todo: Check the client data provider, and update based on that
		if (packet.event === 'MESSAGE_CREATE') {
			const m: Message = new Message(this.#client, packet.data);
			this.#client.dataStore?.messages.set(m.id, m);
			this.#client.dataStore?.users.set(m.author.id, m.author);
			this.#client.emit('messageCreate', m);
			this.#client.emit('message', m);
		}

		if (packet.event === 'MESSAGE_UPDATE') {
			const m: Message = new Message(this.#client, packet.data);
			const cached = this.#client.dataStore?.messages.get(m.id);
			this.#client.dataStore?.messages.set(m.id, m);
			this.#client.dataStore?.users.set(m.author.id, m.author);
			this.#client.emit('messageUpdate', m, cached || null);
		}

		if (packet.event === 'GUILD_CREATE') {
			if (packet.data.unavailable) {
				if (this.#client.dataStore?.guilds.has(packet.data.id)) {
					this.#client.dataStore.guilds.get(packet.data.id).unavailable = true;
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
	}

	public async wsError(ev: Event | ErrorEvent): Promise<void> {
		console.error(ev);
	}
}