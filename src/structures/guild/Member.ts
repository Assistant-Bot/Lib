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
import { MemberData } from "../../net/common/Types.ts";
import Base from "../Base.ts";
import User from "../User.ts";
import Guild from "./Guild.ts";
import Role from "./Role.ts";

export default class Member extends Base {
	public user!: User;
	public owner!: boolean;
	public roles!: string[];
	public premiumSince?: string;
	public nick?: string;
	public mute!: boolean;
	public joinedAt!: string;
	public deaf!: boolean;
	#guild_id: string

	public constructor(client: Client, data: MemberData) {
		super(client, data.user!.id);
		this.update(data);
		this.#guild_id = data.guild_id as string;
	}

	public update(data: MemberData): void {
		this.user = new User(this.client, data.user!);
		this.roles = data.roles;
		this.premiumSince = data.premium_since;
		this.nick = data.nick;
		this.mute = data.mute;
		this.joinedAt = data.joined_at;
		this.deaf = data.deaf;
	}

	public get guild(): Guild {
		return this.client.dataManager?.guilds.get(this.#guild_id);
	}

	public resolveRoles(): Role[] {
	 	return this.roles.map(id => this.guild.roles.get(id)!);
	}
}