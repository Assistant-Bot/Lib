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
import Client from '../../Client.ts';
import type {
	ChannelData,
	MessageConstructorData,
	MessageData,
	Snowflake,
} from '../../net/common/Types.ts';
import Message, { MessageContent } from '../Message.ts';
import GuildChannel from './GuildChannel.ts';

export default class TextChannel extends GuildChannel {
	public lastMessageId?: string;
	public lastMessage?: Message;
	public lastPinTimestamp?: number;
	public rateLimitPerUser?: number;

	public constructor(client: Client, data: ChannelData) {
		super(client, data);
		super.update(data);
		this.update(data);
	}

	public async update(data: ChannelData): Promise<void> {
		if (data.rate_limit_per_user) {
			this.rateLimitPerUser = data.rate_limit_per_user;
		}

		if (data.last_message_id) {
			this.lastMessageId = data.last_message_id;
			if (this.client.dataManager?.messages.has(this.lastMessageId)) {
				this.lastMessage = this.client.dataManager.messages.get(
					this.lastMessageId
				);
				if (this.lastMessage instanceof Promise) {
					this.lastMessage = await this.lastMessage;
				}
			}
		}

		if (data.last_pin_timestamp) {
			this.lastPinTimestamp = Date.parse(data.last_pin_timestamp);
		}
	}

	/**
	 * Send a message to the channel
	 * @param content
	 */
	public async send(content: MessageContent): Promise<Message> {
		if (typeof content === 'string') {
			content = {
				content: content,
			};
		}

		const mData: MessageData = await this.request.createMessage(
			this.id,
			content
		);

		const m: Message = new Message(this.client, mData);
		this.client.dataManager?.messages.set(m.id, m);

		return m;
	}

	/**
	 * Sends a codeblock
	 * @param code
	 * @param content
	 */
	public async sendBlock(code: string, content: string): Promise<Message> {
		return this.send('```' + code + '\n' + content + '\n```');
	}

	public async deleteMessage(id: Snowflake<18>): Promise<boolean> {
		return await this.request.deleteMessage(this.id, id);
	}

	public async deleteMessages(messages: Snowflake<18>[]): Promise<boolean> {
		return await this.request.deleteMessages(this.id, messages);
	}

	public async editMessage(
		content: MessageConstructorData | string,
		messageID: string
	): Promise<Message> {
		if (typeof content === 'string') {
			content = {
				content: content,
			};
		}
		const res: MessageData = await this.request.editMessage(
			this.id,
			messageID,
			content
		);
		return new Message(this.client, res);
	}

	public async pinMessage(messageid: Snowflake<18>): Promise<void> {
		await this.request.pinMessage(this.id, messageid);
		return;
	}

	public async setRateLimit(time: number): Promise<boolean> {
		let updated: GuildChannel = await super.edit({
			rateLimitPerUser: time,
		});
		return (
			(updated as TextChannel).rateLimitPerUser === this.rateLimitPerUser
		);
	}

	public async getMessages(
		limit: number = 50,
		params?: { around?: number; before?: number; after?: number }
	): Promise<Message[]> {
		const msgs = await this.request.getMessages(this.id, limit, params);
		return msgs.map((m) => new Message(this.client, m));
	}

	public async addReaction(id: string, emoji: string) {
		return await this.request.createReaction(this.id, id, emoji);
	}

	public async deleteReaction(
		userId: string = '@',
		msgId: string,
		emoji: string
	): Promise<void> {
		// TO DO: Redo this with the request handler
		if (userId === '@') {
			return await this.request.deleteMeReaction(this.id, msgId, emoji);
		} else {
			return await this.request.deleteUserReaction(
				this.id,
				msgId,
				emoji,
				userId
			);
		}
	}

	public async getReactions(
		limit: number = 25,
		params?: { around?: number; before?: number; after?: number }
	) {}

	public async deleteAllReactions(
		channelId: string,
		msgId: string,
		emoji?: string
	): Promise<void> {
		if (emoji) {
			return await this.request.deleteAllReactionsEmoji(
				channelId,
				msgId,
				emoji
			);
		} else {
			return await this.request.deleteAllReactions(channelId, msgId);
		}
	}
}
