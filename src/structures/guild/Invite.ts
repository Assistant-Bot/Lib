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
import { InviteData, PartialChannelData } from "../../net/common/Types.ts";
import User from "../User.ts";
import Guild from "./Guild.ts";

export default class Invite {
	public code!: string;
	public guild?: Guild;
	public channel!: PartialChannelData;
	public inviter!: Partial<User>;
	public targetUser?: Partial<User>;
	public targetUserType!: 1;
	public approximatePresenceCount!: number;
	public approximateMemberCount!: number;

	public constructor(data: InviteData) {
		this.update(data);
	}

	public update(data: InviteData) {
		this.code = data.code;
		this.guild = data.guild;
		this.channel = data.channel;
		this.inviter = data.inviter as Partial<User>;
		this.targetUser = data.target_user;
		this.targetUserType = 1;
		this.approximateMemberCount = data.approximate_member_count || 0;
		this.approximatePresenceCount = data.approximate_presence_count || 0;
	}
}