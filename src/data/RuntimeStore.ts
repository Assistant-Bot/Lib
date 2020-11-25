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

import type { Payload } from "../net/ws/packet/Packet.ts";
import type Channel from "../structures/Channel.ts";
import type Emoji from "../structures/guild/Emoji.ts";
import type Guild from "../structures/guild/Guild.ts";
import type Message from "../structures/Message.ts";
import type User from "../structures/User.ts";
import Collection from '../util/Collection.ts';
import DataStore from "./DataStore.ts";

export default class RuntimeStore extends DataStore {
	#channels: Collection<string, Channel> = new Collection();
	#emojis: Collection<string, Emoji> = new Collection();
	#guilds: Collection<string, Guild> = new Collection();
	#messages: Collection<string, Message> = new Collection();
	#users: Collection<string, User> = new Collection();
	#reactions: Collection<string, any> = new Collection();

	/**
	 * Get a structure based on it's id
	 * This should return the structure.
	 * @param id
	 */
	public get(id: string): any {
		return null;
	}

	/**
	 * Update a structure in the datastore with a new payload.
	 * Should create a structure if it does not exist.
	 * @param id
	 * @param data
	 */
	public update(id: string, data: Payload): void {

	}

	/**
	 * Updates a structure if it exists in the collection
	 * @param collection
	 * @param id
	 * @param data
	 */
	public updateIfExists(collection: Collection<string, any>, id: string, data: Payload): boolean {
		if (!collection.has(id)) return false;

		collection.get(id).update(data);
		return false;
	}

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
	public get emoijs(): any {
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