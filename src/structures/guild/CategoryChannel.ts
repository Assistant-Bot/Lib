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