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
import type { ApplicationOptionType, InteractionData, InteractionDataRecieve, InteractionResponse, InteractionResponseType } from "../../net/common/Types.ts";
import Base from "../Base.ts";
import Guild from "../guild/Guild.ts";
import Member from "../guild/Member.ts";
import TextChannel from "../guild/TextChannel.ts";

export default class Interaction extends Base {
	public member!: Member;
	public type!: ApplicationOptionType;
	public id!: string;
	public data!: InteractionData;
	public guild?: Guild;
	public channel!: TextChannel | null;
	#channelid!: string;
	#token!: string;

	public constructor(client: Client, data: InteractionDataRecieve) {
		super(client, data.id);
		this.update(data);
	}

	public async update(data: InteractionDataRecieve): Promise<void> {
		this.member = new Member(this.client, data.member);
		this.type = data.type;
		this.id = data.id;
		this.data = data.data;
		this.#token = data.token;
		this.#channelid = data.channel_id;
		this.channel = await this.client.channels.get(this.#channelid);
		this.guild = await this.client.guilds.get(data.guild_id);
	}

	public async getChannel(): Promise<TextChannel | null> {
		const chan = await this.client.channels.get(this.#channelid);

		if (chan === null) {
			let res = await this.request.getChannel(this.#channelid);
			if (!!res) {
				this.channel = new TextChannel(this.client, res);
				this.client.channels.set(this.channel.id, this.channel);
			}

			return this.channel;
		}

		this.channel = chan;

		return chan;
	}

	public async respond(response: InteractionResponse): Promise<void> {
		await this.request.createInteractionResponse(this.id, this.#token, response);
	}
}