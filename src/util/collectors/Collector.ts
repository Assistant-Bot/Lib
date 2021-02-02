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
import Client from "../../Client.ts";

export default abstract class Collector<T> implements AsyncIterable<T> {
	#client: Client;
	#limit: number;

	public constructor(client: Client, limit: number = 10) {
		this.#client = client;
		this.#limit = limit;
	}

	// @ts-ignore
	private async listener(): AsyncGenerator<T, any, unknown>;

	async *[Symbol.asyncIterator](): AsyncGenerator<T> {
		if (this.#limit-- !== 0) {
			yield* await this.listener();
		}
		return { done: true };
	}
}