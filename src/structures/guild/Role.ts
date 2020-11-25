/***
 *                    _     _              _
 *      /\           (_)   | |            | |
 *     /  \   ___ ___ _ ___| |_ __ _ _ __ | |_
 *    / /\ \ / __/ __| / __| __/ _` | '_ \| __|
 *   / ____ \\__ \__ \ \__ \ || (_| | | | | |_
 *  /_/    \_\___/___/_|___/\__\__,_|_| |_|\__|
 *
 * Copyright (C) 2020 John Bergman
 *
 * This is private software, you cannot redistribute and/or modify it in any way
 * unless given explicit permission to do so. If you have not been given explicit
 * permission to view or modify this software you should take the appropriate actions
 * to remove this software from your device immediately.
 */
import Client from "../../Client.ts";
import { RoleData } from "../../net/common/Types.ts";
import Base from "../Base.ts";

export default class Role extends Base {
    public name!: string;
	public permissions: any;
	public position!: number;
	public color!: number;
	public hoist!: boolean;
	public mentionable!: boolean;

	public constructor(client: Client, data: RoleData) {
        super(client, data.id);
        this.update(data)
    }

    public update(data: RoleData) {
        this.name = data.name;
		this.permissions = data.permissions;
		this.position = data.position;
		this.color = data.color;
		this.hoist = data.hoist;
		this.mentionable = data.mentionable;
    }
}