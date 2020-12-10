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
import type { GuildData, InviteData, PartialChannelData } from "../../net/common/Types.ts";
import Base from "../Base.ts";
import type User from "../User.ts";
import Guild from "./Guild.ts";

export default class Invite extends Base {
	public code!: string;
	public guild?: Partial<Guild> | Partial<GuildData>;
	public channel!: PartialChannelData;
	public inviter!: Partial<User>;
	public targetUser?: Partial<User>;
	public targetUserType!: 1;
	public approximatePresenceCount!: number;
	public approximateMemberCount!: number;

	public constructor(client: Client, data: InviteData) {
		super(client, '0');
		this.update(data);
	}

	public async update(data: InviteData): Promise<void> {
		this.code = data.code;
		this.channel = data.channel;
		this.inviter = data.inviter as Partial<User>;
		this.targetUser = data.target_user;
		this.targetUserType = 1;
		this.approximateMemberCount = data.approximate_member_count || 0;
		this.approximatePresenceCount = data.approximate_presence_count || 0;

		if (!await this.client.guilds.has((data.guild as GuildData).id)) {
			this.guild = data.guild;
		} else {
			this.guild = await this.client.guilds.get((data.guild as GuildData).id);
		}
	}
}