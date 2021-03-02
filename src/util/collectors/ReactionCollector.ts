import Client from "../../Client.ts";
import { ReactionData } from "../../net/common/Types.ts";
import Emoji from "../../structures/guild/Emoji.ts";
import Member from "../../structures/guild/Member.ts";
import Message from "../../structures/Message.ts";
import EventAdapter from "../client/EventAdapter.ts";
import Collector, { CollectorOptions } from "./Collector.ts";

export type ReactionFilterType = (msg: ReactionData) => Promise<boolean> | boolean;

export default class ReactionCollector extends Collector<ReactionData> {
	#client: Client<EventAdapter>;
	#filter?: ReactionFilterType

	public constructor(client: Client<EventAdapter>, opts?: CollectorOptions, filter?: ReactionFilterType) {
		super(client, opts || {});
		this.#client = client;
		this.#filter = filter;
	}

	protected async listener(): Promise<ReactionData> {
		return new Promise((resolve, _reject) => {
			let lstnr = (msg: Message | Partial<Message>, member: Member | Partial<Member>, emoji: Emoji | Partial<Emoji>) => {
				this.#client.events.removeListener('reactionAdd', lstnr);
				if (this.#filter) {
					msg.reactions?.forEach(reaction => {
						if(this.#filter!(reaction)) {
							resolve({
								count: reaction.count,
								me: reaction.me,
								emoji: emoji
							});
						}
					});
				} else if (!this.#filter) {
					this.#client.events.removeListener('reactionAdd', lstnr);
					msg.reactions?.forEach(reaction => {
						resolve({
							count: reaction.count,
							me: reaction.me,
							emoji: emoji
						});
					});
				}
			}
			this.#client.on('reactionAdd', lstnr);
		});
	}

}