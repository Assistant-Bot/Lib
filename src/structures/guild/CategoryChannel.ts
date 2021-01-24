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
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 */
import Collection from "../../util/Collection.ts";
import GuildChannel from "./GuildChannel.ts";

export default class CategoryChannel extends GuildChannel {
	public get children(): Collection<string, GuildChannel> { // Might make this an array?
		const children: Collection<string, GuildChannel> = new Collection();
		const channels = this.guild.channels;
		for(const channel of channels) {
			children.set(channel.id, channel);
		}
		return children;
	}
}