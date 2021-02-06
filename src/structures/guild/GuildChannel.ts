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
import type { ChannelData, ChannelEditOption, InviteCreateOptions, InviteData } from "../../net/common/Types.ts";
import Channel from "../channel/Channel.ts";
import Guild from "./Guild.ts";
import Invite from "./Invite.ts";
import Permission from "./permission/Permission.ts";

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

	public update(data: ChannelData): void {
		this.name = data.name || '';
		this.position = data.position || -1;
		this.permissions = data.permission_overwrites;
	}

	public get guild(): Guild {
		return this.client.dataManager?.guilds.get(this.#guild_id);
	}

	public async edit(o: ChannelEditOption): Promise<this> {
		const cData = await this.request.editChannel(this.id, o);
		this.client.dataManager?.channels.update(cData);
		return this;
	}

	public async delete(): Promise<boolean> {
		const res: boolean = await this.request.deleteChannel(this.id);

		if (res === true) {
			this.client.dataManager?.channels.delete(this.id);
		}

		return res;
	}

	public async editPosition(pos: number): Promise<boolean> {
		return await this.guild.editChannelPosition(this, pos);
	}

	public async editPermission(overwriteID: string, o: {allow: number, deny: number, type: "member" | "role" }): Promise<boolean> {
		return await this.guild.editChannelPermission(this, overwriteID, o)
	}

	public async deletePermission(overwriteID: string): Promise<boolean> {
		return await this.guild.deleteChannelPermission(this, overwriteID);
	}

	public async createInvite(o?: InviteCreateOptions): Promise<Invite> {
		const res: InviteData = await this.request.createChannelInvites(this.id, o);
		return new Invite(this.client, res);
	}

	public async getInvites(): Promise<Invite[]> {
		const res: InviteData[] = await this.request.getChannelInvites(this.id);
		return res.map(i => new Invite(this.client, i))
	}
}