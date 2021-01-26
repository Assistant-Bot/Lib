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
import type { ChannelData, ChannelTypesNumeric } from "../../net/common/Types.ts";
import Channel from "./Channel.ts";
import CategoryChannel from "../guild/CategoryChannel.ts";
import NewsChannel from "../guild/NewsChannel.ts";
import StoreChannel from "../guild/StoreChannel.ts";
import TextChannel from "../guild/TextChannel.ts";
import VoiceChannel from "../guild/VoiceChannel.ts";
import DMChannel from "./GroupChannel.ts";

export default class UnknownChannel extends Channel {
	public readonly data: ChannelData;
	public constructor(client: Client, data: ChannelData) {
		super(client, data);
		super.update(data);
		this.data = data;
	}
}

export function makeChannel(client: Client, data: ChannelData) {
	switch (data.type as ChannelTypesNumeric) {
		case 0:
			return new TextChannel(client, data);
		case 1:
			return new DMChannel(client, data);
		case 2:
			// Voice channel
			return new VoiceChannel(client, data);
		case 3:
			return new DMChannel(client, data);
		case 4:
			return new CategoryChannel(client, data);
		case 5:
			return new NewsChannel(client, data);
		case 6:
			return new StoreChannel(client, data);
		default:
			return new UnknownChannel(client, data);
	}
}