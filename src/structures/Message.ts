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
import type Client from "../Client.ts";
import type { ChannelData, EmbedData, MemberData, MessageData, RoleData, UserData } from "../net/common/Types.ts";
import Base from "./Base.ts";
import Channel from "./Channel.ts";
import GuildChannel from "./guild/GuildChannel.ts";
import User from "./User.ts";

export type MessageContent = string | {
	embeds?: EmbedData[];
	content?: string;
	tts?: boolean;
	allowed_mentions?: {
		roles?: string[],
		users?: string[],
		replied_user?: boolean;
	};
	message_reference?: {
		message_id?: string;
		channel_id?: string;
		guild_id?: string;
	};
	file?: Uint8Array;
}

export default class Message extends Base {
	public channel!: Channel;
	public guild?: any;
	public author!: User;
	public content!: string;

	public constructor(client: Client, data: MessageData) {
		super(client, data.id);
		this.update(data);
	}

	public update(data: MessageData): void {
		// todo: make this be fetched if it does not exist (some how)
		this.channel = this.client.dataStore?.channels.get(data.id) || null;
		this.guild = (this.channel instanceof GuildChannel) ? this.channel.guild : null;
		this.author = new User(this.client, data.author);
		this.content = data.content;
	}
}