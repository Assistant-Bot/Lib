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
import type { GuildData, InviteData, PartialChannelData } from "../../net/common/Types.ts";
import EventAdapter from "../../util/client/EventAdapter.ts";
import Base from "../Base.ts";
import type User from "../User.ts";
import Guild from "./Guild.ts";

export default class Invite extends Base {
	/** Code of the invite */
	public code!: string;
	/** Guild for the invite */
	public guild?: Partial<Guild> | Partial<GuildData>;
	/** Channel invite was made */
	public channel!: PartialChannelData;
	/** Creator of the invite */
	public inviter!: Partial<User>;
	/** Target user of the invite */
	public targetUser?: Partial<User>;
	/** Target user type */
	public targetUserType!: 1;
	/** Presence count of the invite */
	public approximatePresenceCount!: number;
	/** Member count of the invite */
	public approximateMemberCount!: number;

	public constructor(client: Client<EventAdapter>, data: InviteData) {
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