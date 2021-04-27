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
import { Promiseable } from "../../net/common/Types.ts";
import EventAdapter from "../client/EventAdapter.ts";

export interface CollectorOptions {
	limit?: number;
	timeout?: number;
}

export default abstract class Collector<T> implements AsyncIterable<T> {
	protected client: Client<EventAdapter>;
	protected limit: number;
	protected timeout: number;

	public constructor(client: Client<EventAdapter>, opts: CollectorOptions = {}) {
		this.client = client;
		this.limit = opts.limit || 10;
		this.timeout = opts.timeout || 60000;
	}

	async*[Symbol.asyncIterator](): AsyncGenerator<T> {
		for (let i = 0; i < this.limit; i++) {
			yield this.listener();
		}
	}

	/**
	 * Collects the messages and returns them when collected.
	 */
	public async collect(): Promise<T[]> {
		let collected: T[] = [];

		for (let i = 0; i < this.limit; i++) {
			collected.push(await this.listener());
		}

		return collected;
	}

	/**
	 * Listener should auto handle timeouts!
	 */
	protected abstract listener(): Promise<T>;

	/**
	 * Stop collector whether or not its complete
	 */
	public kill(): void {
		this.limit = 0;
	}
}