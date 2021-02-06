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
import type Client from "../Client.ts";
import type { UserData } from "../net/common/Types.ts";
import Base from "./Base.ts";
import DMChannel from "./channel/DMChannel.ts";
import Message, { MessageContent } from "./Message.ts";

export default class User extends Base {
	public bot!: boolean;
	public username!: string;
	public discriminator!: string;
	public avatar!: string;
	public system!: boolean;
	#dm?: DMChannel;

	public constructor(client: Client, data: UserData) {
		super(client, data.id);
		this.update(data);
	}

	public update(data: UserData): void {
		this.bot = !!data.bot;
		this.username = data.username;
		this.discriminator = data.discriminator;
		this.avatar = data.avatar || '';
		this.system = !!data.system;
	}

	public async send(content: MessageContent): Promise<Message> {
		if(this.#dm) {
			return this.#dm.send(content);
		} else {
			return (await this.getDMChannel()).send(content);
		}
	}

	public async getDMChannel(): Promise<DMChannel> {
		const data = await this.request.getDMChannel(this.id);
		const ch = new DMChannel(this.client, data);
		this.#dm = ch;
		return ch;
	}

	/**
	 * Get the default avatar the user should have.
	 */
	public get defaultAvatar(): number {
		return parseInt(this.discriminator) % 5;
	}

	/**
	 * Mention the user
	 */
	public get mention(): string {
		return `<@${this.id}>`;
	}

	/**
	 * The users username and discriminator combined.
	 */
	public get tag(): string {
		return this.username + '#' + this.discriminator;
	}
}