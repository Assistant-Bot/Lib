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
import { EventEmitter, GenericFunction, WrappedFunction } from 'https://deno.land/std@0.78.0/node/events.ts';
import DataStore from "./data/DataStore.ts";
import { GatewayResponseBot, MessageData } from "./net/common/Types.ts";
import Endpoints, { GATEWAY_URL } from "./net/rest/Endpoints.ts";
import RequestHandler, { RequestHandlerOptions } from "./net/rest/RequestHandler.ts";
import { Connector } from "./net/ws/Connector.ts";
import Generic from "./net/ws/generic/Generic.ts";

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
    | "pinUpdate"
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
    public requestHandler!: RequestHandler;

    #dataStore?: DataStore;
    #wsManager!: Connector;
    #shardMode: ClientShardMode | 'Unknown' = 'Unknown';

    public constructor(opts: Partial<ClientOptions> = {}, customStore?: DataStore) {
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

        if (customStore) {
            this.#dataStore = customStore;
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

        this.#wsManager.connect(token);
    }

    public on(event: "message" | "messageCreate", listener: (message: MessageData) => any): any;
    public on(event: "messageDelete", listener: (message: Partial<MessageData> | MessageData) => any): any;
    public on(event: "ready", listener: (session_id: string, shard: number[] | null, version: number) => any): any;
    public on(event: ClientEvents, listener: GenericFunction | WrappedFunction): any {
        return super.on(event, listener);
    }

    public once(event: ClientEvents, listener: GenericFunction): any {
        return super.once(event, listener);
    }

    public emit(event: ClientEvents, ...args: any[]): any {
        return super.emit(event, ...args);
    }

    /**
     * This determines how the client is handling guilds
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

    /**
     * Gets the data store.
     */
    public get dataStore(): DataStore | null {
        return this.#dataStore || null;
    }

    /**
     * Sets the data store (once).
     */
    public set dataStore(store: DataStore | null) {
        if (store instanceof DataStore) {
            if (!this.#dataStore) {
                this.#dataStore = store;
            }
        }
    }
}