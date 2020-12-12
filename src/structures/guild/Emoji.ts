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
import type { EmojiData } from "../../net/common/Types.ts";
import Base from "../Base.ts";

export default class Emoji extends Base {
	public roles?: string[];
	public requireColons?: boolean;
	public name!: string | null;
	public managed?: boolean;
	public available?: boolean;
	public animated?: boolean;

	public constructor(client: Client, data: EmojiData) {
		super(client, data.id || '');
		this.update(data);
	}

	public update(data: EmojiData): void {
		this.roles = data.roles;
		this.requireColons = data.require_colons;
		this.name = data.name;
		this.managed = data.managed;
		this.available = data.available;
		this.animated = data.animated;
	}
}