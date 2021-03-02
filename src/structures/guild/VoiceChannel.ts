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
import EventAdapter from "../../util/client/EventAdapter.ts";
import GuildChannel from "./GuildChannel.ts";

export default class VoiceChannel extends GuildChannel {
	/** Bitrate of the channel */
	public bitrate?: number;
	/** User limit of the channel */
	public userLimit?: number;
	/** Array of member IDs in the channel */
	public members: string[];

	public constructor(client: Client<EventAdapter>, data: ChannelData) {
		super(client, data);
		this.members = [];
		super.update(data);
		this.update(data);
	}

	public update(data: ChannelData) {
		if (data.bitrate) {
			this.bitrate = data.bitrate;
		}

		if (data.user_limit) {
			this.userLimit = data.user_limit;
		}
	}

	/**
	 * Set the bitrate of the channel
	 * @param bitrate Bitrate
	 */
	public async setBitrate(bitrate: number): Promise<boolean> {
		let updated: GuildChannel = await super.edit({
			bitrate: bitrate,
		});
		return (
			(updated as VoiceChannel).bitrate === this.bitrate
		);
	}

	/**
	 * Set the user limit of the channel
	 * @param userLimit User Limit
	 */
	public async setUserLimit(userLimit: number): Promise<boolean> {
		let updated: GuildChannel = await super.edit({
			userLimit: userLimit,
		});
		return (
			(updated as VoiceChannel).userLimit === this.userLimit
		);
	}

	/**
	 * Used to join a channel
	 * @param opt Join options
	 */
	public async join(opt?: Partial<{ mute: boolean, deaf: boolean }>) {
		await this.client.ws.send({
			op: 4, d: {
				guild_id: this.guild.id,
				channel_id: this.id,
				self_mute: opt?.mute ?? true,
				self_deaf: opt?.deaf ?? true
			}
		});
		this.members.push(this.client.user.id)
	}

	/**
	 * Used to leave a channel
	 */
	public async leave() {
		await this.client.ws.send({
			op: 4, d: {
				guild_id: this.guild.id,
				channel_id: this.id,
				self_mute: false,
				self_deaf: false
			}
		});
		this.members.splice(this.members.indexOf(this.client.user.id), -1);
	}

	/**
	 * Used to edit the voice state
	 * @param opt Voice State Options
	 */
	public async editVoiceState(opt: Partial<{ mute: boolean, deaf: boolean }>) {
		await this.client.ws.send({
			op: 4, d: {
				guild_id: this.guild.id,
				channel_id: this.id,
				self_mute: opt.mute ?? true,
				self_deaf: opt.deaf ?? true
			}
		});
	}
}