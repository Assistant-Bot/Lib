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
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 */

import { Payload } from "../net/ws/packet/Packet.ts";

export default abstract class DataStore {
	/**
	 * Get a structure based on it's id
	 * This should return the structure.
	 * @param id
	 */
	public abstract get(id: string): any;

	/**
	 * Update a structure in the datastore with a new payload.
	 * Should create a structure if it does not exist.
	 * @param id
	 * @param data
	 */
	public abstract update(id: string, data: Payload): any;

	/**
	 * Deletes a structure in the datastore based on it's id.
	 * @param id
	 */
	public abstract delete(id: string): Promise<boolean> | boolean;

	/**
	 * Get all channels stored within the store.
	 */
	public abstract get channels(): any;

	/**
	 * Gets all the emoijs stored within the store.
	 */
	public abstract get emoijs(): any;

	/**
	 * Get all guidls stored within the store.
	 */
	public abstract get guilds(): any;

	/**
	 * Get all messages stored within the store.
	 */
	public abstract get messages(): any;

	/**
	 * Gets all the users stored within the store.
	 */
	public abstract get users(): any;

	/**
	 * Gets all the reactions stored within the store.
	 */
	public abstract get reactions(): any;
}