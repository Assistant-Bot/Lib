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
import Client from "../../Client.ts";
import type { ChannelData, MessageData, Snowflake } from "../../net/common/Types.ts";
import Message, { MessageContent } from "../Message.ts";
import GuildChannel from "./GuildChannel.ts";

export default class TextChannel extends GuildChannel {
	public lastMessageId?: string;
	public lastMessage?: Message;
	public rateLimitPerUser?: number;

	public constructor(client: Client, data: ChannelData) {
		super(client, data);
		this.update(data);
	}

	public async update(data: ChannelData): Promise<void> {
		if (data.rate_limit_per_user) {
			this.rateLimitPerUser = data.rate_limit_per_user;
		}

		if (data.last_message_id) {
			this.lastMessageId = data.last_message_id;
			if (this.client.dataManager?.messages.has(this.lastMessageId)) {
				this.lastMessage = this.client.dataManager.messages.get(this.lastMessageId);
				if (this.lastMessage instanceof Promise) {
					this.lastMessage = await this.lastMessage;
				}
			}
		}
	}

	/**
	 * Send a message to the channel
	 * @param content
	 */
	public async send(content: MessageContent): Promise<Message> {
		if (typeof content === 'string') {
			content = {
				content: content
			}
		}

		const mData: MessageData = await this.request.createMessage(this.id, content);

		const m: Message = new Message(this.client, mData);
		this.client.dataManager?.messages.set(m.id, m);

		return m;
	}

	/**
	 * Sends a codeblock
	 * @param code
	 * @param content
	 * @deprecated
	 */
	public async sendBlock(code: string, content: string): Promise<Message> {
		return this.send("```" + code + "\n" + content + "\n```");
	}

	public async deleteMessage(id: Snowflake<18>): Promise<boolean> {
		return await this.request.deleteMessage(this.id, id);
	}

	public async deleteMessages(messages: Snowflake<18>[]): Promise<boolean> {
		return await this.request.deleteMessages(this.id, messages);
	}
}