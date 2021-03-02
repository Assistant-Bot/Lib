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
import type { Payload } from "../net/ws/packet/Packet.ts";

export default abstract class DataStore<K, V> {
	protected structure: V;
	#limit: number;

	public constructor(stucture: V, limit?: number) {
		this.structure = stucture;
		this.#limit = limit || 100;
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
	public abstract add(idOrData: K | Payload): V | Promise<V | null> | null;

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

	/**
	 * Gets the amount of "keys" or data in a store.
	 */
	public abstract get size(): number;

	/**
	 * Gets the size limit for this store.
	 */
	public get limit(): number {
		return this.#limit;
	}

	[Symbol.iterator]: Iterable<V>
	public abstract values(): Iterable<V>;

	/**
	 * Converts the object into an array.
	 */
	public toArray(): V[] {
		return [...this.values()];
	}
}