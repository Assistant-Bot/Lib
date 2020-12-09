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
import type { MemberData, Snowflake } from "../../net/common/Types.ts";
import Base from "../Base.ts";
import User from "../User.ts";

export default class Member extends Base {
	public user!: User;
	public owner!: boolean;
	public roles!: string[];
	public premiumSince?: string;
	public nick?: string;
	public mute!: boolean;
	public joinedAt!: string;
	public deaf!: boolean;

	public constructor(client: Client, data: MemberData) {
		super(client, data.id);
		this.update(data);
	}

	public update(data: MemberData): void {
		this.user = new User(this.client, data.user || { id: '000000000000000000' as Snowflake<18>, username: 'Unavailable', discriminator: '6969' });
		// Possible solution if this is null?
		this.roles = data.roles;
		this.premiumSince = data.premium_since;
		this.nick = data.nick;
		this.mute = data.mute;
		this.joinedAt = data.joined_at;
		this.deaf = data.deaf;
	}
}