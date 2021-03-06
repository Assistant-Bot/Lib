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