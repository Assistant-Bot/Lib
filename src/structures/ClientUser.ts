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
import type Client from "../Client.ts";
import type { UserData } from "../net/common/Types.ts";
import User from "./User.ts";

export default class ClientUser extends User {
	public verified!: boolean;
	public email!: string;

	public constructor(client: Client, data: UserData) {
		super(client, data);
		super.update(data);
		this.update(data);
	}

	public update(data: UserData) {
		this.verified = data.verified as boolean;
		this.email = data.email as string;
	}
}