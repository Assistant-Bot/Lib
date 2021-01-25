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
import type Client from "../../Client.ts";
import type { EmojiData } from "../../net/common/Types.ts";
import Base from "../Base.ts";

export default class Emoji extends Base {
	private static clientInstance: Client;
	public roles?: string[];
	public requireColons?: boolean;
	public name!: string | null;
	public managed?: boolean;
	public available?: boolean;
	public animated?: boolean;

	public constructor(client: Client, data: EmojiData) {
		super(client, data.id || '');
		this.update(data);
		Emoji.clientInstance = client;
	}

	public update(data: EmojiData): void {
		this.roles = data.roles;
		this.requireColons = data.require_colons;
		this.name = data.name;
		this.managed = data.managed;
		this.available = data.available;
		this.animated = data.animated;
	}

	public get system(): boolean {
		return /\w/.test(this.name || "") && this.id === null;
	}

	public static parse(emoji: string): Emoji {
		const webEncoded: boolean = /%/.test(emoji);

		if (webEncoded) {
			emoji = decodeURIComponent(emoji);
		}

		const matches = emoji.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);

		if (!matches) {
			throw "Invalid emoji, can not be parsed";
		}

		return new Emoji(Emoji.clientInstance, {
			animated: Boolean(matches[1]),
			name: matches[2] || emoji,
			id: matches[3] || null
		});
	}
}