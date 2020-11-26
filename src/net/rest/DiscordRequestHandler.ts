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
import { MessageContent } from "../../structures/Message.ts";
import type { MessageConstructorData, MessageData, Snowflake } from "../common/Types.ts";
import Endpoints from "./Endpoints.ts";
import RequestHandler from "./RequestHandler.ts";

class DiscordRequestHandler extends RequestHandler {
	/**
	 * Deletes a message from a channel
	 * @param channelId
	 * @param messageid
	 */
	public async deleteChannel(channelId: string): Promise<boolean> {
		const res: Response = await this.makeAndSend(Endpoints.channel(channelId), 'DELETE');
		return res.status === 200;
	}

	/**
	 * Deletes a message from a channel
	 * @param channelId
	 * @param messageid
	 */
	public async deleteMessage(channelId: string, messageid: string): Promise<boolean> {
		const res: Response = await this.makeAndSend(Endpoints.channel_messages(channelId, messageid), 'DELETE');
		return res.status === 200;
	}

	/**
	 * Deletes a message from a channel
	 * @param channelId
	 * @param messageid
	 */
	public async deleteMessages(channelId: string, messageid: string, messages: Snowflake<18>[]): Promise<boolean> {
		const res: Response = await this.makeAndSend(
			Endpoints.channel_messages(channelId, messageid) + '/bulk-delete',
			'POST',
			{ messages },
			[],
		);
		return res.status === 200;
	}

	/**
	 * Deletes a message from a channel
	 * @param channelId
	 * @param messageid
	 */
	public async editMessage(channelId: string, messageid: string, content: MessageConstructorData): Promise<MessageData> {
		const res: Response = await this.makeAndSend(Endpoints.channel_messages(channelId, messageid), 'PATCH', content, []);
		return res.json();
	}

	/**
	 * Creates a message in a channel
	 * @param channelId
	 * @param messageid
	 */
	public async createMessage(channelId: string, content: MessageContent): Promise<MessageData> {
		const res: Response = await this.makeAndSend(Endpoints.channel_messages(channelId), 'POST', content, []);
		return res.json();
	}
}

export default DiscordRequestHandler;