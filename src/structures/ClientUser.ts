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
import type Client from "../Client.ts";
import type { UserData } from "../net/common/Types.ts";
import type EventAdapter from "../util/client/EventAdapter.ts";
import User from "./User.ts";

export default class ClientUser extends User {
	public verified!: boolean;
	public email!: string;

	public constructor(client: Client<EventAdapter>, data: UserData) {
		super(client, data);
		super.update(data);
		this.update(data);
	}

	public update(data: UserData) {
		this.verified = data.verified as boolean;
		this.email = data.email as string;
	}
}
