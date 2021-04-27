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
import type Client from "../Client.ts";
import type { AnyStructureData } from "../net/common/Types.ts";
import DiscordRequestHandler from "../net/rest/DiscordRequestHandler.ts";
import EventAdapter from "../util/client/EventAdapter.ts";

export default abstract class Base {
	/** Client */
	#client: Client<EventAdapter>;
	/** ID given by Discord */
	public id: string;

	public constructor(client: Client<EventAdapter>, id: string) {
		this.id = id;
		this.#client = client;
	}

	/**
	 * Calculated date that a structure was created using 1420070400000 as EPOCH
	 */
	public get createdAt() {
		return Math.floor(parseInt(this.id) / 4194304) + 1420070400000;
	}

	/**
	 * Called by assistant to update structure data.
	 * This should be similar, if not equal to creating a new structure.
	 * @param data - The data to update the structure
	 */
	public abstract update(data: AnyStructureData): any;

	/**
	 * Gets the object as a string.
	 */
	public toString(): string {
		return Deno.inspect(this, { depth: 3, colors: false });
	}

	/**
	 * Get the discord reuest handler of the client.
	 */
	protected get request(): DiscordRequestHandler {
		return this.client.discordHandler;
	}

	/**
	 * Protected so it's not accessible outside the class.
	 * Work around to typescript's "protected" variables.
	 */
	protected get client(): Client<EventAdapter> {
		return this.#client;
	}

	/**
	 * Protected so it's not accessible outside the class.
	 * Work around to typescript's "protected" variables.
	 */
	protected set client(client: Client<EventAdapter>) {
		this.#client = client;
	}
}