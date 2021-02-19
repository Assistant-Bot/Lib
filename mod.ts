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
export type {
	ClientEvents,
	ClientOptions,
	ClientShardMode
} from './src/Client.ts';
export type {
	CommandEvents,
	CommandArgOptions,
	CommandOptions
} from './src/command/Command.ts';
export type {
	PrefixResolveFunction,
	CommandHandlerOptions
} from './src/command/CommandHandler.ts';
export type {
	PermissionResolvable,
	PermissionTestResolvable
} from './src/command/permission/PermissionManager.ts';

export * as Types from './src/net/common/Types.ts';
export type { ConnectionStates } from './src/net/ws/Connector.ts';
export type { GatewayEvent } from './src/net/ws/packet/EventPacket.ts';
export type { Payload } from './src/net/ws/packet/Packet.ts';
export type { MessageContent } from './src/structures/Message.ts';


/**
 * Exports starting in main directory
 */
export { default as Client } from './src/Client.ts';
export { default as Command } from './src/command/Command.ts';
export { default as CommandHandler } from './src/command/CommandHandler.ts';
export { default as Permission } from './src/command/permission/Permission.ts';
export { default as PermissionManager } from './src/command/permission/PermissionManager.ts';
export { default as DataManager } from './src/data/DataManager.ts';
export { default as DataStore } from './src/data/DataStore.ts';
export { default as RuntimeManager } from './src/data/runtime/RuntimeManager.ts';
export { default as RuntimeStore } from './src/data/runtime/RuntimeStore.ts';
export { default as Module } from './src/module/Module.ts';
export { default as DiscordRequestHandler } from './src/net/rest/DiscordRequestHandler.ts';
export {
	REST_VERSION,
	GATEWAY,
	GATEWAY_URL,
	DOMAIN,
	BASE_URL,
	BASE_API_URL,
	default as Endpoints
} from './src/net/rest/Endpoints.ts';
export { default as RequestHandler } from './src/net/rest/RequestHandler.ts';
export { Connector } from './src/net/ws/Connector.ts';
export { default as GenericConnector } from './src/net/ws/generic/Generic.ts';
export { default as EventPacket } from './src/net/ws/packet/EventPacket.ts';
export { default as HeartBeatPacket } from './src/net/ws/packet/HeartbeatPacket.ts';
export { default as Packet } from './src/net/ws/packet/Packet.ts';
export { default as ResumePacket } from './src/net/ws/packet/ResumePacket.ts';
// todo: src/structures/application/*
export { default as Base } from './src/structures/Base.ts';
export { default as ClientUser } from './src/structures/ClientUser.ts';
export { default as Message } from './src/structures/Message.ts';
export { default as User } from './src/structures/User.ts';
export { default as Channel } from './src/structures/channel/Channel.ts';
export { default as DMChannel } from './src/structures/channel/DMChannel.ts';
export { default as GroupChannel } from './src/structures/channel/GroupChannel.ts';
export { default as UnknownChannel } from './src/structures/channel/UnknownChannel.ts';
export { default as CategoryChannel } from './src/structures/guild/CategoryChannel.ts';
export { default as Emoji } from './src/structures/guild/Emoji.ts';
export { default as Guild } from './src/structures/guild/Guild.ts';
export { default as GuildChannel } from './src/structures/guild/GuildChannel.ts';
export { default as Invite } from './src/structures/guild/Invite.ts';
export { default as Member } from './src/structures/guild/Member.ts';
export { default as NewsChannel } from './src/structures/guild/NewsChannel.ts';
export { default as Presence } from './src/structures/guild/Presence.ts';
export { default as Role } from './src/structures/guild/Role.ts';
export { default as RulesChannel } from './src/structures/guild/RulesChannel.ts';
export { default as StoreChannel } from './src/structures/guild/StoreChannel.ts';
export { default as TextChannel } from './src/structures/guild/TextChannel.ts';
export { default as VoiceChannel } from './src/structures/guild/VoiceChannel.ts';
export { default as Application } from './src/structures/oauth/Application.ts';
export * as Async from './src/util/Async.ts';
export { default as Collection } from './src/util/Collection.ts';
export { default as Embed } from './src/util/Embed.ts';
export { default as Intents } from './src/util/Intents.ts';
export { default as Queue } from './src/util/Queue.ts';
export { default as EnvStore } from './src/util/EnvStore.ts';
export { default as MessageCollector } from './src/util/collectors/MessageCollector.ts';