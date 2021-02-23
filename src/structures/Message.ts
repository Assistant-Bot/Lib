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
import type Client from "../Client.ts";
import type { EmbedData, MessageConstructorData, MessageData, MessageType, ReactionData } from "../net/common/Types.ts";
import Base from "./Base.ts";
import TextChannel from "./guild/TextChannel.ts";
import Guild from "./guild/Guild.ts";
import GuildChannel from "./guild/GuildChannel.ts";
import User from "./User.ts";
import Emoji from "./guild/Emoji.ts";
import Member from "./guild/Member.ts";

export type MessageContent = string | {
	embed?: EmbedData[];
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
	/** Channel of the message */
	public channel!: TextChannel;
	/** Author/User of the message */
	public author!: User;
	/** Content of the message */
	public content?: string;
	/** Epoch timestamp of the message */
	public timestamp!: number;
	/** [COMMAND UTIL] Prefix of the message */
	public prefix?: string;
	/** [COMMAND UTIL] Arguments in the message */
	public args!: string[];
	/** Embed in the message */
	public embed?: EmbedData;
	/** Embeds in the message */
	public embeds?: EmbedData[];
	/** Reactions in the message */
	public reactions?: ReactionData[];
	/** Type of message */
	public type!: MessageType;

	public constructor(client: Client, data: MessageData) {
		super(client, data.id);
		this.update(data);
	}

	public update(data: MessageData): void {
		// todo: make this be fetched if it does not exist (some how)
		this.channel = this.client.dataManager?.channels.get(data.channel_id) || null;
		this.type = data.type;

		if (data.author) {
			this.author = new User(this.client, data.author);
		}

		if (data.content) {
			this.content = data.content;
		}

		if (data.embeds) {
			this.embeds = data.embeds;
		}

		if (data.embed) {
			this.embed = data.embed;
		}

		if(data.reactions) {
			this.reactions = data.reactions;
		}

		this.timestamp = Date.parse(data.timestamp);
	}

	/**
	 * Get member context of the message
	 */
	public get member(): Member | undefined {
		return this.channel.guild.members.get(this.author.id);
	}

	/**
	 * Get guild of the message
	 */
	public get guild(): Guild | null {
		return (this.channel as GuildChannel).guild;
	}

	/**
	 * Used to edit an existing message
	 * @param content New Message Content
	 */
	public async edit(content: MessageConstructorData | string): Promise<Message> {
		if (typeof content === "string") {
			content = {
				content: content
			}
		}
		const mData: MessageData = await this.request.editMessage(this.channel.id, this.id, content);
		const m: Message = new Message(this.client, mData);
		this.client.dataManager?.messages.set(m.id, m);
		return m;
	}

	/**
	 * Used to reply to a user
	 * @param content Message Content
	 */
	public async reply(content: MessageContent): Promise<Message> {
		if (typeof content === 'string') {
			content = {
				content: content,
				message_reference: {
					guild_id: this.channel.guild.id,
					channel_id: this.channel.id,
					message_id: this.id
				}
			}
		} else {
			content.message_reference = {
				guild_id: this.channel.guild.id as string,
				channel_id: this.channel.id,
				message_id: this.id
			}
		}
		return this.channel.send(content);
	}

	/**
	 * Used to delete an existing message
	 */
	public async delete(): Promise<boolean> {
		return await this.request.deleteMessage(this.channel.id, this.id);
	}

	/**
	 * Used to pin a message
	 */
	public async pin(): Promise<boolean> {
		return await this.request.pinMessage(this.channel.id, this.id);
	}

	/**
	 * Used to react to a message
	 * @param emoji Emoji or emoji string
	 */
	public async react(emoji: Emoji | string): Promise<boolean> {
		// todo: should this return a reaction object?
		return await this.request.createReaction(this.channel.id, this.id, emoji);
	}

	/**
	 * [UTILITY]
	 * Gets the command from the sent message. (may be deprecated in the future)
	 * @param prefix
	 */
	public getCommand(prefix: string = "!"): string {
		if (this.content && this.content.indexOf(prefix) === 0) {
			this.args = this.content.slice(prefix.length).trim().split(/ +/g);
			return this.args.shift()?.toLowerCase() || "";
		}
		return "";
	}
}
