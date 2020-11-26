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
import type Client from "../../Client.ts";
import type { ChannelData, MessageConstructorData, MessageData } from "../../net/common/Types.ts";
import Endpoints from "../../net/rest/Endpoints.ts";
import Channel from "../Channel.ts";
import Message, { MessageContent } from "../Message.ts";
import Guild from "./Guild.ts";

export default class GuildChannel extends Channel {
	public name!: string;
	public guild!: Guild;
	public position!: number;
	public permissions!: any;

	public constructor(client: Client, data: ChannelData) {
		super(client, data);
		this.update(data);
	}

	public update(data: ChannelData): void {
		this.name = data.name || '';
		this.guild = this.client.dataStore?.guilds.get(data.guild_id) || data.guild_id;
		this.position = data.position || -1;
		this.permissions = data.permission_overwrites;
	}

	/**
	 * Send a message to the channel
	 * @param content
	 */
	public async send(content: MessageContent): Promise<Message> {
		const mData: MessageData = await this.request.createMessage(this.id, content);

		const m: Message = new Message(this.client, mData);
		this.client.dataStore?.messages.set(m.id, m);

		return m;
	}

	public async delete(): Promise<boolean> {
		const res: boolean = await this.request.deleteChannel(this.id);

		if (res === true) {
			this.client.dataStore?.channels.delete(this.id);
		}

		return res;
	}
}