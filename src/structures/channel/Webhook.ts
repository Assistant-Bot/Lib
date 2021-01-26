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
import type Client from "../../Client.ts";
import type { CreateWebhookData, ExecuteWebhookData, MessageConstructorData, WebhookData } from "../../net/common/Types.ts";
import Base from "../Base.ts";
import { MessageContent } from "../Message.ts";
import User from "../User.ts";

export default class Webhook extends Base {
	public type: 1 | 2;
	public guildId: string;
	public channelId: string;
	public user?: User;
	public token: string;
	public name: string;

	public constructor(client: Client, data: WebhookData) {
		super(client, data.id);
		this.type = data.type;
		this.guildId = data.guild_id;
		this.channelId = data.channel_id;
		this.user = data.user !== undefined ? new User(client, data.user as any) : undefined;
		this.token = data.token || "";
		this.name = data.name;
	}

	public update(data: WebhookData): void {
		this.id = data.id;
		this.type = data.type;
		this.guildId = data.guild_id;
		this.channelId = data.channel_id;
		this.user = data.user !== undefined ? new User(this.client, data.user as any) : undefined;
		this.token = data.token || "";
		this.name = data.name;
	}

	public async create(): Promise<Webhook> {
		const data: WebhookData = await this.request.createWebhook({
			name: this.name,
			channel_id: this.channelId
		});
		this.update(data);
		return this;
	}

	public async edit(messageid: string, content: string | any) {
		if (typeof content === "string") {
			content = {
				content: content
			}
		}
		this.request.editWebhook(this.id, this.token, messageid, content);
	}

	public async execute(opts: ExecuteWebhookData): Promise<void> {
		this.request.executeWebhook(this.id, this.token, opts);
	}

	public send(msg: MessageConstructorData) {
		return this.execute({
			content: (typeof msg === 'string') ? msg : msg.content,
			embeds: (typeof msg === 'string') ? undefined : msg.embed ? [ msg.embed ] : undefined
		});
	}

	public async delete(): Promise<void> {
		if (this.id === "0" || this.token === "") {
			return;
		}
		await this.request.deleteWebhook(this.id, this.token);
		return;
	}

	public static async create(client: Client, opts: CreateWebhookData): Promise<Webhook> {
		let instance: Webhook = new this(client, {
			guild_id: opts.channel_id,
			channel_id: opts.channel_id,
			name: opts.name || "Unknown Webhook#0000",
			application_id: "000000000000000000000",
			id: "0",
			type: 1
		});
		return await instance.create();
	}
}