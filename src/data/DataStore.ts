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
import type { Payload } from "../net/ws/packet/Packet.ts";

export default abstract class DataStore<K, V> {
	protected structure: V;

	public constructor(stucture: V) {
		this.structure = stucture;
	}

	/**
	 * Updates the structure in the store.
	 *
	 * @warn If it is a promise, there is no garauntee
	 * it will update to the client accessor immediately.
	 * @param structure
	 */
	public abstract update(structure: V): V | Promise<V>;

	/**
	 * Get the structure from the store.
	 * @param id
	 */
	public abstract get(id: K): V | null | Promise<V | null>;

	/**
	 * Add the structure from the store
	 */
	public abstract add(idOrData: K|Payload): V | Promise<V | null> | null;

	/**
	 * Whether or not the id exists in the store.
	 * @param id
	 */
	public abstract has(id: K): boolean | Promise<boolean>;

	/**
	 * Deletes the id from the store.
	 * @param id
	 */
	public abstract delete(id: K): boolean | Promise<boolean>;

	/**
	 * Sets the key of the structure into the datastore.
	 * @param id
	 * @param structure
	 */
	public abstract set(id: K, structure: V): V | Promise<V | null> | null;
}