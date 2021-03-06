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
import Message from "../../structures/Message.ts";
import Client from "../../Client.ts";
import Collector, { CollectorOptions } from "./Collector.ts";
import EventAdapter from "../client/EventAdapter.ts";

export type MessageFilterType = (msg: Message) => Promise<boolean> | boolean;

export default class MessageCollector extends Collector<Message> {
	#client: Client<EventAdapter>;
	#filter?: MessageFilterType;

	public constructor(client: Client<EventAdapter>, opts?: CollectorOptions, filter?: MessageFilterType) {
		super(client, opts || {});
		this.#client = client;
		this.#filter = filter;
	}

	protected async listener(): Promise<Message> {
		return new Promise((resolve, reject) => {
			let lstnr = (cancel: boolean, msg: Message) => {
				if (this.#filter && this.#filter(msg)) {
					cancel = true;
					resolve(msg);
				} else if (!this.#filter) {
					cancel = true;
					resolve(msg);
				}
			}
			if (this.client.events.luc) {
				this.#client.events.luc?.('message', lstnr);
			} else {
				reject(new Error("Event adapter does not support cancellable listeners."));
			}
		});
	}
}