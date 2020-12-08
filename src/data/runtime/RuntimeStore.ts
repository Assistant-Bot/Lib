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
import type Base from "../../structures/Base.ts";
import Collection from "../../util/Collection.ts";
import DataStore from "../DataStore.ts";

export default class RuntimeStore<K extends string, V extends Base> extends DataStore<K, V> {
	#dataSet: Collection<K, V> = new Collection();

	public constructor(structure: V) {
		super(structure);
	}

	/**
	 * Updates the structure in the store.
	 *
	 * @warn If it is a promise, there is no garauntee
	 * it will update to the client accessor immediately.
	 * @param structure
	 */
	public update(structure: V): V {
		this.#dataSet.set(structure.id as K, structure);
		return structure;
	}

	/**
	 * Get the structure from the store.
	 * @param id
	 */
	public get(id: K): V | null  {
		return this.#dataSet.get(id) || null;
	}

	/**
	 * Add the structure from the store
	 */
	public add(idOrData: K | Payload): V | null {
		if (typeof idOrData === 'string') {
			if (this.has(idOrData)) {
				return null;
			} else {
				// @ts-ignore
				this.#dataSet.set(idOrData, new this.structure(idOrData));
				return this.get(idOrData);
			}
		} else {
			if (this.has(idOrData.d.id)) {
				return null;
			} else {
				// @ts-ignore
				this.#dataSet.set(idOrData.d.id, new this.structure(idOrData.d));
				return this.get(idOrData.d.id);
			}
		}
	}

	/**
	 * Whether or not the id exists in the store.
	 * @param id
	 */
	public has(id: K): boolean {
		return this.#dataSet.has(id);
	}

	/**
	 * Deletes the id from the store.
	 * @param id
	 */
	public delete(id: K): boolean {
		return this.#dataSet.delete(id);
	}

	/**
	 * Sets the key of the structure into the datastore.
	 * @param id
	 * @param structure
	 */
	public set(id: K, structure: V): V | null {
		this.#dataSet.set(id, structure);
		return structure || null;
	}
}