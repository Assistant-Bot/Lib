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
import { ChannelData, MessageData } from "../../net/common/Types.ts";
import Message, { MessageContent } from "../Message.ts";
import TextChannel from "../guild/TextChannel.ts";
import Client from "../../Client.ts";

export default class DMChannel extends TextChannel { // TextChannel? // Just nullify guild
	/**
	 * Used to send a message in the channel
	 * @param content Message Content
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

	// @ts-ignore
	public get guild(): undefined {
		return undefined;
	}
}