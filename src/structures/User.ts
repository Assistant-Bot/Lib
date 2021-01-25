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
import { MessageContent } from "./Message.ts";

export default class User extends Base {
	public bot!: boolean;
	public username!: string;
	public discriminator!: string;
	public avatar!: string;
	public system!: boolean;

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