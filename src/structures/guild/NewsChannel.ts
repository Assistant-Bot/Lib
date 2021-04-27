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
import Client from "../../Client.ts";
import { ChannelData } from "../../net/common/Types.ts";
import EventAdapter from "../../util/client/EventAdapter.ts";
import TextChannel from "./TextChannel.ts";

export default class NewsChannel extends TextChannel {

	public constructor(client: Client<EventAdapter>, data: ChannelData) {
		super(client, data);
	}

	public async crosspostMessage(id: string) {
		// return this.request.crosspostMessage();
	}
}