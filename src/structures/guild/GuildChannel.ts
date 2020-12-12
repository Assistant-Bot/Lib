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
import type { ChannelData } from "../../net/common/Types.ts";
import Channel from "../channel/Channel.ts";
import Guild from "./Guild.ts";

export default class GuildChannel extends Channel {
	public name!: string;
	public position!: number;
	public permissions!: any;
	#guild_id: string;

	public constructor(client: Client, data: ChannelData) {
		super(client, data);
		super.update(data);
		this.#guild_id = data.guild_id as string;
		this.update(data);
	}

	public get guild(): Guild {
		return this.client.dataManager?.guilds.get(this.#guild_id);
	}

	public update(data: ChannelData): void {
		this.name = data.name || '';
		this.position = data.position || -1;
		this.permissions = data.permission_overwrites;
	}

	public async delete(): Promise<boolean> {
		const res: boolean = await this.request.deleteChannel(this.id);

		if (res === true) {
			this.client.dataManager?.channels.delete(this.id);
		}

		return res;
	}
}