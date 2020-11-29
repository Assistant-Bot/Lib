import { MessageData } from "../../net/common/Types.ts";
import Channel from "../Channel.ts";
import Message, { MessageContent } from "../Message.ts";

export default class DMChannel extends Channel { // TextChannel? // Just nullify guild
	public async send(content: MessageContent): Promise<Message> {
		if (typeof content === 'string') {
			content = {
				content: content
			}
		}

		const mData: MessageData = await this.request.createMessage(this.id, content);

		const m: Message = new Message(this.client, mData);
		this.client.dataStore?.messages.set(m.id, m);

		return m;
	}
}