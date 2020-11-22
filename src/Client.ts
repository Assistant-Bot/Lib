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
    }
}

/**
 * Helper type for allowing partial keys
 */
export type Partial<T> = {
    [P in keyof T]?: T[P];
}

export type ClientGuildMode = 'Nodes' | 'Shards' | 'Clusters';

export default class Client extends EventEmitter {
    public readonly options: ClientOptions;
    #guildMode: ClientGuildMode | 'Unknown' = 'Unknown';

    public constructor(opts: Partial<ClientOptions> = {}) {
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
    }

    /**
     * Connects the client to the discord gateway.
     * @param token
     */
    public async connect(token: string): Promise<void> {
        // refactor this
        const req = new Request('https://discord.com/api/v8/gateway/bot');
        req.headers.set('Authorization', token);
        const res = await (await fetch(req)).json();
        console.log(res);
    }

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
    public get clientGuildMode(): ClientGuildMode | 'Unknown' {
        return this.#guildMode;
    }

    public set clientGuildMode(mode: ClientGuildMode | 'Unknown') {
        this.#guildMode = mode;
    }

    private async getGatewayInfo(): Promise<void> {
        
    }
}