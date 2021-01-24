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
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 */
import { MessageData } from "../../net/common/Types.ts";
import Channel from "./Channel.ts";
import Message, { MessageContent } from "../Message.ts";

export default class DMChannel extends Channel { // TextChannel? // Just nullify guild
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
}