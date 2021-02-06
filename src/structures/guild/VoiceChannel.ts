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
import Client from "../../Client.ts";
import { ChannelData } from "../../net/common/Types.ts";
import GuildChannel from "./GuildChannel.ts";

export default class VoiceChannel extends GuildChannel {
	public bitrate?: number;
	public userLimit?: number;
	public members: string[];

	public constructor(client: Client, data: ChannelData) {
		super(client, data);
		this.members = [];
		super.update(data);
		this.update(data);
	}

	public update(data: ChannelData) {
		if(data.bitrate) {
			this.bitrate = data.bitrate;
		}

		if(data.user_limit) {
			this.userLimit = data.user_limit;
		}
	}

	public async setBitrate(bitrate: number): Promise<boolean> {
		let updated: GuildChannel = await super.edit({
			bitrate: bitrate,
		});
		return (
			(updated as VoiceChannel).bitrate === this.bitrate
		);
	}

	public async setUserLimit(userLimit: number): Promise<boolean> {
		let updated: GuildChannel = await super.edit({
			userLimit: userLimit,
		});
		return (
			(updated as VoiceChannel).userLimit === this.userLimit
		);
	}

	public async join(opt?: Partial<{mute: boolean, deaf: boolean}>) {
		await this.client.ws.send({op: 4, d: {
			guild_id: this.guild.id,
			channel_id: this.id,
			self_mute: opt?.mute ?? true,
			self_deaf: opt?.deaf ?? true
		}});
		this.members.push(this.client.user.id)
	}

	public async leave() {
		await this.client.ws.send({op: 4, d: {
			guild_id: this.guild.id,
			channel_id: this.id,
			self_mute: false,
			self_deaf: false
		}});
		this.members.splice(this.members.indexOf(this.client.user.id), -1);
	}

	public async editVoiceState(opt: Partial<{mute: boolean, deaf: boolean}>) {
		await this.client.ws.send({op: 4, d: {
			guild_id: this.guild.id,
			channel_id: this.id,
			self_mute: opt.mute ?? true,
			self_deaf: opt.deaf ?? true
		}});
	}
}