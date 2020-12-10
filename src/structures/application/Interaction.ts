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
	public channel!: TextChannel;
	public guild?: Guild;
	public timestamp: number;
	#token!: string;

	public constructor(client: Client, data: InteractionDataRecieve) {
		super(client, data.id);
		this.timestamp = Date.now();
		this.update(data);
	}

	public async update(data: InteractionDataRecieve): Promise<void> {
		this.member = new Member(this.client, data.member);
		this.type = data.type;
		this.id = data.id;
		this.data = data.data;
		this.#token = data.token;
		this.channel = await this.client.channels.get(data.channel_id);
		this.guild = await this.client.guilds.get(data.guild_id);
	}

	public async respond(response: InteractionResponse): Promise<void> {
		await this.request.createInteractionResponse(this.id, this.#token, response);
	}
}