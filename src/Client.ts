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
import DataManager from "./data/DataManager.ts";
import type DataStore from "./data/DataStore.ts";
import type { GatewayResponseBot, PresenceOptions, RoleData, VoiceState } from "./net/common/Types.ts";
import DiscordRequestHandler from "./net/rest/DiscordRequestHandler.ts";
import Endpoints, { GATEWAY_URL } from "./net/rest/Endpoints.ts";
import RequestHandler, { RequestHandlerOptions } from "./net/rest/RequestHandler.ts";
import type { Connector } from "./net/ws/Connector.ts";
import Generic from "./net/ws/generic/Generic.ts";
import type { Payload } from "./net/ws/packet/Packet.ts";
import type Interaction from "./structures/application/Interaction.ts";
import type Channel from "./structures/channel/Channel.ts";
import type ClientUser from "./structures/ClientUser.ts";
import type Emoji from "./structures/guild/Emoji.ts";
import type Guild from "./structures/guild/Guild.ts";
import type Invite from "./structures/guild/Invite.ts";
import type Member from "./structures/guild/Member.ts";
import type Role from "./structures/guild/Role.ts";
import type Message from "./structures/Message.ts";
import Application from "./structures/oauth/Application.ts";
import type User from "./structures/User.ts";
import Collection from "./util/Collection.ts";
import Intents, { IntentTypes } from "./util/Intents.ts";

/**
 * Events emitted when recieved from the websocket.
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
 * Options for the client.
 */
export interface ClientOptions {
	connection: {
		/**
		 * Whether or not to reconnect if disconnected.
		 */
		autoReconnect?: boolean;

		/**
		 * Amount of attempts to reconnect
		 */
		maxReconnectTries?: number;

		/**
		 * Amount of attempts to resume the session from discord.
		 */
		maxResumeTries?: number;

		/**
		 * Whether or not to compress data from discord
		 */
		compress?: boolean;

		/**
		 * The amount of time until the client auto disconnects;
		 * If no response to discord is recieved.
		 */
		timeout?: number;

		/**
		 * Whether or not to respect discord response to connecting through the bot gateway.
		 * This should be "true" if you want to shard, or cluster
		 */
		respectDiscordGateway?: boolean;

		/**
		 * Emits the "ws" event (when enabled)
		 */
		emitPayloads?: boolean;
	};
	cache: {
		/**
		 * Should objects be cached in memory?
		 */
		memory?: boolean;

		/**
		 * Should updates from the gateway be applied to cache?
		 */
		updates?: boolean;

		/**
		 * The maximum amount of cached objects allowed
		 * @deprecated
		 */
		max?: number;

		/**
		 * The limit of cached structures in a single store.
		 */
		limit?: number;

		/**
		 * The maximum limit of children structures in a single structure
		 * IE: Guild#roles, Member#roles, Guild#emojis
		 */
		subLimit?: number;
	};
	sharding: {
		/**
		 * Whether or not to use discord recommended Sharding and Cluster count.
		 */
		useDiscord: boolean;
	},
	rest?: RequestHandlerOptions;
	intents?: IntentTypes[] | Number;
}

/**
 * Helper type for allowing partial keys
 */
export type Partial<T> = {
	[P in keyof T]?: T[P];
}

/**
 * Shard mode that the client is in.
 */
export type ClientShardMode = 'Nodes' | 'Shards' | 'Clusters';

export default class Client extends EventEmitter {
	public readonly options: ClientOptions;
	public readonly intents: Intents;
	public application: Application | null;
	public requestHandler!: RequestHandler;
	public discordHandler!: DiscordRequestHandler;
	public user!: ClientUser;

	#dataManager?: DataManager;
	#wsManager!: Connector;
	#shardMode: ClientShardMode | 'Unknown' = 'Unknown';

	public constructor(opts: Partial<ClientOptions> = {}, customStore?: DataManager) {
		super();
		const defaults: ClientOptions = {
			connection: {
				autoReconnect: true,
				maxReconnectTries: 500,
				maxResumeTries: -1,
				compress: false,
				timeout: 20000,
				respectDiscordGateway: true,
				emitPayloads: false
			},
			cache: {
				memory: true,
				updates: true,
				limit: 300,
				subLimit: 700
			},
			sharding: {
				useDiscord: false
			},
			intents: Intents.defaults().parse()
		}

		this.options = Object.assign(defaults, opts);
		this.application = null;
		this.intents = (this.options.intents instanceof Array) ? new Intents(this.options.intents) : Intents.from(this.options.intents as number);
		Collection.MAX_SIZE = this.options.cache.subLimit || 300;

		if (customStore) {
			this.#dataManager = customStore;
		}

		Collection.MAX_SIZE = this.options.cache.limit ?? Infinity // Add this, IDK why but guild.members doesnt work w/out it
	}

	/**
	 * Connects the client to the discord gateway.
	 * @param token
	 */
	public async connect(token: string): Promise<void> {
		this.requestHandler = new RequestHandler(this.options.rest || {}, [
			{ name: 'Authorization', value: 'Bot ' + token }
		]);
		this.discordHandler = new DiscordRequestHandler(this.options.rest || {}, [
			{ name: 'Authorization', value: 'Bot ' + token }
		]);

		if (this.options.connection.respectDiscordGateway) {
			const res: GatewayResponseBot = await this.getGatewayInfo();
			if (res.shards === 1) {
				this.#shardMode = 'Nodes';
				this.#wsManager = new Generic(this, GATEWAY_URL);
			} else if (res.shards >= 250000) {
				this.#shardMode = 'Clusters'
				throw new Error('Clusters are not supported yet.');
			} else {
				this.#shardMode = 'Shards'
				throw new Error('Shards are not supported yet.');
			}
		} else {
			this.#shardMode = 'Nodes';
			this.#wsManager = new Generic(this, GATEWAY_URL);
		}

		this.application = await this.resolveApplication();
		this.#wsManager.connect(token, this.intents);
	}

	/**
	 * Disconnects the bot.
	 */
	public async disconnect(): Promise<void> {
		if (!this.#wsManager) throw new Error('Websocket already closed.');

		await this.#wsManager.close();
	}

	public async editStatus(opt: PresenceOptions) {
		await this.ws.send({
			op: 3,
			d: {
				since: opt.since ?? 0,
				game: {
					name: opt.game.name,
					type: opt.game.type,
				},
				afk: opt.afk ?? false,
				status: opt.status
			}
		})
	}

	/**
	 * Gets the oauth application from discord.
	 */
	private async resolveApplication(): Promise<Application | null> {
		const resp = await this.discordHandler.getApplication();

		if (!resp) return null;

		return new Application(this, resp);
	}

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
	public on(event: "messageDeleteBulk", listener: (messages: (Message | string)[]) => any): this

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
	public on(event: "voiceRegionUpdate", listener: (state: {token: string, guild_id: string, endpoint: string}) => any): this;

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
	 * Listen to a gateway event
	 */
	public on(event: ClientEvents, listener: GenericFunction | WrappedFunction): any {
		return super.on(event, listener);
	}

	public once(event: ClientEvents, listener: GenericFunction): this {
		return super.once(event, listener);
	}

	public emit(event: ClientEvents, ...args: any[]): boolean {
		return super.emit(event, ...args);
	}

	/**
	 * Gets the current shard mode of the client.
	 * EG:
	 *  - Clusters
	 *  - Shards
	 *  - Generic
	 */
	public get shardMode(): ClientShardMode | 'Unknown' {
		return this.#shardMode;
	}

	/**
	 * Gets the gateway information from discord.
	 */
	private async getGatewayInfo(): Promise<GatewayResponseBot> {
		const req: Request = new Request(Endpoints.rest_gateway(true));
		const res = await this.requestHandler.request(req) as Response;
		const json = await res.json();

		if (res.status === 202 || res.status === 200) {
			return json as GatewayResponseBot;
		} else {
			return {
				url: GATEWAY_URL,
				shards: 1,
				session_start_limit: {
					total: 1000,
					remaining: 1000,
					reset_after: 0,
					max_concurrency: 1
				}
			}
		}
	}

	public sendPayload(p: Payload) {
		this.#wsManager.send(p);
	}

	/**
	 * Gets the data store.
	 */
	public get dataManager(): DataManager | null {
		return this.#dataManager || null;
	}

	public get ws(): Connector {
		return this.#wsManager;
	}

	/**
	 * Sets the data store (once).
	 */
	public set dataManager(store: DataManager | null) {
		if (store instanceof DataManager) {
			if (!this.#dataManager) {
				this.#dataManager = store;
			}
		}
	}

	/**
	 * Get all channels stored within the store.
	 */
	public get channels(): DataStore<string, any> {
		return this.dataManager?.channels as DataStore<string, any>;
	}

	/**
	 * Gets all the emoijs stored within the store.
	 */
	public get emoijs(): DataStore<string, any> {
		return this.dataManager?.emojis as DataStore<string, any>;
	}

	/**
	 * Get all guidls stored within the store.
	 */
	public get guilds(): DataStore<string, any> {
		return this.dataManager?.guilds as DataStore<string, any>;
	}

	/**
	 * Get all messages stored within the store.
	 */
	public get messages(): DataStore<string, any> {
		return this.dataManager?.messages as DataStore<string, any>;
	}

	/**
	 * Gets all the users stored within the store.
	 */
	public get users(): DataStore<string, any> {
		return this.dataManager?.users as DataStore<string, any>;
	}

	/**
	 * Gets all the reactions stored within the store.
	 */
	public get reactions(): DataStore<string, any> {
		return this.dataManager?.reactions as DataStore<string, any>;
	}
}