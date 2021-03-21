import { Payload } from "../../net/ws/packet/Packet.ts";
import Base from "../../structures/Base.ts";
import Collection from "../../util/Collection.ts";
import DataStore from "../DataStore.ts";

export default class AsyncRuntimeStore<K extends string, V extends Base> extends DataStore<K, V> {
	#dataSet: Collection<K, V> = new Collection();

	public constructor(structure: V, limit?: number) {
		super(structure, limit);
	}

	public update(structure: V): V {
		throw new Error('Not implemented')
	}

	public updatePayload(data: any): V {
		throw new Error('Not implemented')
	}
	
	/**
	 * Get the structure from the store.
	 * @param id
	 */
	public get(id: K): V | null {
		throw new Error('Not implemented')
	}

	/**
	 * Add the structure from the store
	 */
	public add(idOrData: K | Payload, append: boolean = true): V | null {
		throw new Error('Not implemented')
	}

	/**
	 * Whether or not the id exists in the store.
	 * @param id
	 */
	public has(id: K): boolean {
		throw new Error('Not implemented')
	}

	/**
	 * Deletes the id from the store.
	 * @param id
	 */
	public delete(id: K): boolean {
		throw new Error('Not implemented')
	}

	/**
	 * Sets the key of the structure into the datastore.
	 * @param id
	 * @param structure
	 */
	public set(id: K, structure: V, overwrite: boolean = true): V | null {
		throw new Error('Not implemented')
	}

	public get size(): number {
		return this.#dataSet.size;
	}

	[Symbol.iterator]: IterableIterator<V>
	public values(): IterableIterator<V> {
		return this.#dataSet.values();
	}
}
