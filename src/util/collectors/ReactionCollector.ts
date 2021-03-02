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
		return new Promise((resolve, reject) => {
			let lstnr = (cancel: boolean, msg: Message | Partial<Message>, member: Member | Partial<Member>, emoji: Emoji | Partial<Emoji>) => {
				cancel = true;
				if (this.#filter) {
					msg.reactions?.forEach(reaction => {
						if (this.#filter!(reaction)) {
							resolve({
								count: reaction.count,
								me: reaction.me,
								emoji: emoji
							});
						}
					});
				} else if (!this.#filter) {
					cancel = true
					msg.reactions?.forEach(reaction => {
						resolve({
							count: reaction.count,
							me: reaction.me,
							emoji: emoji
						});
					});
				}
			}
			if (this.client.events.luc) {
				this.#client.events.luc?.('reactionAdd', lstnr);
			} else {
				reject(new Error("Event adapter does not support cancellable listeners."));
			}
		});
	}

}