import Message from "../Message.ts";
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

// export default class MessageCollector implements AsyncIterableIterator<Message> {
// 	private client: Client;
// 	private filter?: MessageFilterType

// 	public constructor(client: Client, filter?: MessageFilterType) {
// 		this.client = client;
// 		this.filter = filter;
// 	}

// 	[Symbol.asyncIterator](): AsyncIterableIterator<Message> {
// 		// TO DO
// 	}
// }

