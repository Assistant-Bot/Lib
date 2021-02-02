import Message from "../../structures/Message.ts";
import Client from "../../Client.ts";

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
	#client: Client;
	#limit: number
	#filter?: MessageFilterType

	public constructor(client: Client, limit: number = 10, filter?: MessageFilterType) {
		this.#client = client;
		this.#limit = limit;
		this.#filter = filter;
	}

	private async *listener(): AsyncGenerator<Message> {
		yield await new Promise((resolve, reject) => {
			let lstnr = (msg: Message) => {
				if (this.#filter && this.#filter(msg)) {
					this.#client.removeListener('message', lstnr);
					resolve(msg);
				} else if (!this.#filter) {
					this.#client.removeListener('message', lstnr);
					resolve(msg);
				}
			}
			this.#client.on('message', lstnr);
		});
	}

	async *[Symbol.asyncIterator](): AsyncGenerator<Message> {
		if (this.#limit-- !== 0) {
			yield* this.listener();
		}
		return { done: true };
	}
}