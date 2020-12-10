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
import { EventEmitter, GenericFunction, WrappedFunction } from 'https://deno.land/std@0.78.0/node/events.ts';
import DataManager from "./data/DataManager.ts";
import DataStore from "./data/DataStore.ts";
import type { GatewayResponseBot, MessageData, RoleData } from "./net/common/Types.ts";
import DiscordRequestHandler from "./net/rest/DiscordRequestHandler.ts";
import Endpoints, { GATEWAY_URL } from "./net/rest/Endpoints.ts";
import RequestHandler, { RequestHandlerOptions } from "./net/rest/RequestHandler.ts";
import { Connector } from "./net/ws/Connector.ts";
import Generic from "./net/ws/generic/Generic.ts";
import type { Payload } from "./net/ws/packet/Packet.ts";
import AppCommand from "./structures/application/AppCommand.ts";
import Interaction from "./structures/application/Interaction.ts";
import Channel from "./structures/channel/Channel.ts";
import type ClientUser from "./structures/ClientUser.ts";
import Emoji from "./structures/guild/Emoji.ts";
import Guild from "./structures/guild/Guild.ts";
import Member from "./structures/guild/Member.ts";
import Role from "./structures/guild/Role.ts";
import Message from "./structures/Message.ts";
import Application from "./structures/oauth/Application.ts";
import User from "./structures/User.ts";

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
		autoReconnect: boolean;

		/**
		 * Amount of attempts to reconnect
		 */
		maxReconnectTries: number;

		/**
		 * Amount of attempts to resume the session from discord.
		 */
		maxResumeTries: number;

		/**
		 * Whether or not to compress data from discord
		 */
		compress: boolean;

		/**
		 * The amount of time until the client auto disconnects;
		 * If no response to discord is recieved.
		 */
		timeout: number;

		/**
		 * Whether or not to respect discord response to connecting through the bot gateway.
		 * This should be "true" if you want to shard, or cluster
		 */
		respectDiscordGateway: boolean;

		/**
		 * Emits the "ws" event (when enabled)
		 */
		emitPayloads: boolean;
	},
	cache: {
		/**
		 * Should objects be cached in memory?
		 */
		memory: boolean;

		/**
		 * Should updates from the gateway be applied to cache?
		 */
		updates: boolean;

		/**
		 * The maximum amount of cached objects allowed
		 */
		max: number;
	},
	sharding: {
		/**
		 * Whether or not to use discord recommended Sharding and Cluster count.
		 */
		useDiscord: boolean;
	},
	rest?: RequestHandlerOptions
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
	public application: Application | null;
	public requestHandler!: RequestHandler;
	public discordHandler!: DiscordRequestHandler;
	public user!: ClientUser;
	public commands: Map<string, AppCommand> = new Map();

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
				max: -1
			},
			sharding: {
				useDiscord: false
			}
		}

		this.options = Object.assign(defaults, opts);
		this.application = null;

		if (customStore) {
			this.#dataManager = customStore;
		}
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
		this.#wsManager.connect(token);
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
	 * Emitted when a interaction is created
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