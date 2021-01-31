import Message from "../Message.ts";
import Client from "../../Client.ts";
import { MuxAsyncIterator } from "https://deno.land/std/async/mod.ts";

export type MessageFilterType = (msg: Message) => boolean;

/**
 * Example:
 * client.on('message', msg => {
 * 	if(msg.content === '!await') {
 * 		const collector = new MessageCollector(client, (msg) => {
 * 			if(msg.author.id === msg.author.id) return true;
 * 			return false;
 * 		});
 * 
 * 		for await (const msg of collector) {
 * 			console.log(msg.content);
 * 		}
 * 	}
 * })
 */

export default class MessageCollector implements AsyncIterable<Message> {
	private client: Client;
	private limit: number
	private filter?: MessageFilterType

	public constructor(client: Client, limit: number, filter?: MessageFilterType) {
		this.client = client;
		this.limit = limit;
		this.filter = filter;
	}

	private async *iterateMessages(iter: MuxAsyncIterator<Message>): AsyncIterableIterator<Message> {

	}

	[Symbol.asyncIterator](): AsyncIterableIterator<Message> {
		const mux: MuxAsyncIterator<Message> = new MuxAsyncIterator();
		mux.add(this.iterateMessages(mux));
		return mux.iterate();
	}
}