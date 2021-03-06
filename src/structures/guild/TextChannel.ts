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
import Client from '../../Client.ts';
import type {
	ChannelData,
	MessageConstructorData,
	MessageData
} from '../../net/common/Types.ts';
import EventAdapter from "../../util/client/EventAdapter.ts";
import Webhook from "../channel/Webhook.ts";
import Message, { MessageContent } from '../Message.ts';
import GuildChannel from './GuildChannel.ts';

export default class TextChannel extends GuildChannel {
	/** ID of last message sent in the channel */
	public lastMessageId?: string;
	/** Last message sent in the channel */
	public lastMessage?: Message;
	/** Timestamp of last pinned message */
	public lastPinTimestamp?: number;
	/** Rate limit of the channel */
	public rateLimitPerUser?: number;

	public constructor(client: Client<EventAdapter>, data: ChannelData) {
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
	 * @param code Language Code
	 * @param content Message Content
	 */
	public async sendBlock(code: string, content: string): Promise<Message> {
		return this.send('```' + code + '\n' + content + '\n```');
	}

	/**
	 * Delete specific message in the channel
	 * @param id ID of message
	 */
	public async deleteMessage(id: string): Promise<boolean> {
		return await this.request.deleteMessage(this.id, id);
	}

	/**
	 * Delete multiple messages (purge) in the channel
	 * @param messages IDs of messages
	 */
	public async deleteMessages(messages: string[]): Promise<boolean> {
		return await this.request.deleteMessages(this.id, messages);
	}

	/**
	 * Used to edit a message in the channel
	 * @param content Message Content
	 * @param messageID Message ID
	 */
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

	/**
	 * Set the rate limit of the channel
	 * @param time Limit
	 */
	public async setRateLimit(time: number): Promise<boolean> {
		let updated: GuildChannel = await super.edit({
			rateLimitPerUser: time,
		});
		return (
			(updated as TextChannel).rateLimitPerUser === this.rateLimitPerUser
		);
	}

	/**
	 * Used to get messages from a channel
	 * @param limit Limit
	 * @param params Message Fetch Params
	 * @returns
	 */
	public async getMessages(
		limit: number = 50,
		params?: { around?: number; before?: number; after?: number }
	): Promise<Message[]> {
		// @ts-ignore
		const msgs = await this.request.getMessages(this.id, limit, { $params: params });
		return msgs.map((m) => new Message(this.client, m));
	}

	/**
	 * Used to add a reaction to a message
	 * @param id Message ID
	 * @param emoji Emoji String
	 * @returns
	 */
	public async addReaction(id: string, emoji: string) {
		return await this.request.createReaction(this.id, id, emoji);
	}

	/**
	 * Used to delete a reaction from a message
	 * @param userId User ID
	 * @param msgId Message ID
	 * @param emoji Emoji String
	 * @returns
	 */
	public async deleteReaction(
		userId: string = '@',
		msgId: string,
		emoji: string
	): Promise<boolean> {
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

	/**
	 * Used to get reactions from a message
	 * @param limit Limit
	 * @param params Fetch Reactions Params
	 */
	public async getReactions(
		limit: number = 25,
		params?: { around?: number; before?: number; after?: number }
	) { }

	/**
	 * Used to delete all reactions from a message
	 * @param msgId Message ID
	 * @param emoji Emoji String
	 */
	public async deleteAllReactions(
		msgId: string,
		emoji?: string
	): Promise<boolean> {
		if (emoji) {
			return await this.request.deleteAllReactionsEmoji(
				this.id,
				msgId,
				emoji
			);
		} else {
			return await this.request.deleteAllReactions(this.id, msgId);
		}
	}

	/**
	 * Used to pin a message
	 * @param id Message ID
	 */
	public async pinMessage(id: string): Promise<boolean> {
		return await this.request.addPinChannelMessage(this.id, id);
	}

	/**
	 * Used to unpin a message
	 * @param id Message ID
	 */
	public async unpinMessage(id: string): Promise<boolean> {
		return await this.request.deletePinChannelMessage(this.id, id)
	}

	/**
	 * Used to create a webhook in the channel
	 * @param name Name of webhook
	 * @param avatar Avatar of webhook
	 */
	public async createWebhook(name: string, avatar?: string): Promise<Webhook> {
		return Webhook.create(this.client, {
			channel_id: this.id,
			name: name,
			avatar: avatar
		});
	}
}
