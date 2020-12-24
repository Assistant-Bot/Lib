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
import DataStore from "./DataStore.ts";

export default abstract class DataManager {
	/**
	 * The limit on all stores.
	 */
	public limit: number;

	public constructor(limit?: number) {
		this.limit = limit || 100;
	}

	/**
	 * Get all channels stored within the store.
	 */
	public abstract get channels(): DataStore<string, any>;

	/**
	 * Gets all the emoijs stored within the store.
	 */
	public abstract get emojis(): DataStore<string, any>;

	/**
	 * Get all guidls stored within the store.
	 */
	public abstract get guilds(): DataStore<string, any>;

	/**
	 * Get all messages stored within the store.
	 */
	public abstract get messages(): DataStore<string, any>;

	/**
	 * Gets all the users stored within the store.
	 */
	public abstract get users(): DataStore<string, any>;

	/**
	 * Gets all the reactions stored within the store.
	 */
	public abstract get reactions(): DataStore<string, any>;
}