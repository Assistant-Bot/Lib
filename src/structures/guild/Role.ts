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
import type { RoleData } from "../../net/common/Types.ts";
import Base from "../Base.ts";

export default class Role extends Base {
	public name!: string;
	public permissions!: number;
	public position!: number;
	public color!: number;
	public hoist!: boolean;
	public mentionable!: boolean;

	public constructor(client: Client, data: RoleData) {
		super(client, data.id);
		this.update(data)
	}

	public update(data: RoleData): void {
		this.name = data.name;
		this.permissions = parseInt(data.permissions);
		this.position = data.position;
		this.color = data.color;
		this.hoist = data.hoist;
		this.mentionable = data.mentionable;
	}
}
