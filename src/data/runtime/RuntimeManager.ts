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
import type { Payload } from "../../net/ws/packet/Packet.ts";
import Base from "../../structures/Base.ts";
import Channel from "../../structures/channel/Channel.ts";
import Emoji from "../../structures/guild/Emoji.ts";
import Guild from "../../structures/guild/Guild.ts";
import Message from "../../structures/Message.ts";
import User from "../../structures/User.ts";
import DataManager from "../DataManager.ts";
import DataStore from "../DataStore.ts";
import RuntimeStore from "./RuntimeStore.ts";


export default class RuntimeManager extends DataManager {
	#channels = new RuntimeStore<string, typeof Channel & Base>(Channel as typeof Channel & Base);
	#emojis = new RuntimeStore<string, typeof Emoji & Base>(Emoji as typeof Emoji & Base);
	#guilds = new RuntimeStore<string, typeof Guild & Base>(Guild as typeof Guild & Base);
	#messages = new RuntimeStore<string, typeof Message & Base>(Message as typeof Message & Base);
	#users = new RuntimeStore<string, typeof User & Base>(User as typeof User & Base);
	// to-do Reactions!
	#reactions = new RuntimeStore<string, typeof Channel & Base>(Channel as typeof Channel & Base);

	/**
	 * Deletes a structure in the datastore based on it's id.
	 * @param id
	 */
	public delete(id: string): boolean {
		return false;
	}

	/**
	 * Get all channels stored within the store.
	 */
	public get channels(): any {
		return this.#channels;
	}

	/**
	 * Gets all the emoijs stored within the store.
	 */
	public get emojis(): any {
		return this.#emojis;
	}

	/**
	 * Get all guidls stored within the store.
	 */
	public get guilds(): any {
		return this.#guilds;
	}

	/**
	 * Get all messages stored within the store.
	 */
	public get messages(): any {
		return this.#messages;
	}

	/**
	 * Gets all the users stored within the store.
	 */
	public get users(): any {
		return this.#users;
	}

	/**
	 * Gets all the reactions stored within the store.
	 */
	public get reactions(): any {
		return this.#reactions;
	}
}