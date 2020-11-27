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
import type { MessageData } from "../../net/common/Types.ts";
import Message, { MessageContent } from "../Message.ts";
import GuildChannel from "./GuildChannel.ts";

export default class TextChannel extends GuildChannel {
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
		this.client.dataStore?.messages.set(m.id, m);

		return m;
	}
}