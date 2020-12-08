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
import type Client from "../Client.ts";
import type { EmbedData, MessageConstructorData, MessageData } from "../net/common/Types.ts";
import Base from "./Base.ts";
import TextChannel from "./guild/TextChannel.ts";
import Guild from "./guild/Guild.ts";
import GuildChannel from "./guild/GuildChannel.ts";
import User from "./User.ts";

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
	public channel!: TextChannel;
	public author!: User;
	public content!: string;
	public timestamp!: number

	public constructor(client: Client, data: MessageData) {
		super(client, data.id);
		this.update(data);
	}

	public update(data: MessageData): void {
		// todo: make this be fetched if it does not exist (some how)
		this.channel = this.client.dataManager?.channels.get(data.channel_id) || null;
		this.author = new User(this.client, data.author);
		this.content = data.content;
		this.timestamp = Date.parse(data.timestamp);
	}

	public get guild(): Guild | null {
		return (this.channel as GuildChannel).guild;
	}

	public async edit(content: MessageConstructorData): Promise<Message> {
		const mData: MessageData = await this.request.editMessage(this.channel.id, this.id, content);
		const m: Message = new Message(this.client, mData);
		this.client.dataManager?.messages.set(m.id, m);
		return m;
	}

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

	public async delete(): Promise<boolean> {
		return await this.request.deleteMessage(this.channel.id, this.id);
	}

	public async pin(): Promise<void> {
		return await this.request.pinMessage(this.channel.id, this.id);
	}
}
