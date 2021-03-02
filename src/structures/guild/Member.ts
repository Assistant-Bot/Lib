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
import EventAdapter from "../../util/client/EventAdapter.ts";
import Base from "../Base.ts";
import User from "../User.ts";
import Guild from "./Guild.ts";
import Permission, { PermissionBits } from "./permission/Permission.ts";
import Role from "./Role.ts";

export default class Member extends Base {
	/** User of the member */
	public user!: User;
	/** Whether the member is guild owner */
	public owner!: boolean;
	/** IDs of the member's roles */
	public roles!: string[];
	/** The time for how long the user has boosted the guild for */
	public premiumSince?: string;
	/** Nick of the user */
	public nick?: string;
	/** Whether the member is muted */
	public mute!: boolean;
	/** When the user joined at */
	public joinedAt!: string;
	/** Whether the user if deafened */
	public deaf!: boolean;
	/** Guild ID of the member */
	#guild_id: string

	public constructor(client: Client<EventAdapter>, data: MemberData) {
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

	/** 
	 * Guild of the member
	 */
	public get guild(): Guild {
		return this.client.dataManager?.guilds.get(this.#guild_id);
	}

	/**
	 * Permissions of the member (role based)
	 */
	public get permissions(): Permission {
		if (this.id === this.guild.ownerID) {
			return new Permission(['administrator']);
		} else {
			const roles = this.guild.roles;
			let permissions = roles.find(r => r.id === this.guild.id)!.permissions.allow.parse();
			for (let id of this.roles) {
				const role = roles.find(r => r.id === id);
				if (!role) continue;

				const allow = role.permissions.allow.parse();

				if (allow & PermissionBits.ADMINISTRATOR) {
					permissions = new Permission(['administrator']).parse();
					break;
				} else {
					permissions |= allow;
				}
			}
			return Permission.from(permissions);
		}
	}

	/**
	 * Used to ban the member
	 */
	public async ban(): Promise<boolean> {
		return this.guild.banMember(this);
	}

	/**
	 * Used to unban the member
	 * NOTE: Useless method???
	 */
	public async unban(): Promise<boolean> {
		return this.guild.unbanMember(this)
	}

	/**
	 * User to kick the member
	 */
	public async kick(): Promise<boolean> {
		return this.guild.kickMember(this);
	}
}