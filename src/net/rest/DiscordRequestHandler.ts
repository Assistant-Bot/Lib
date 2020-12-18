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
 * This is private software, you cannot redistribute and/or modify it in any way
 * unless given explicit permission to do so. If you have not been given explicit
 * permission to view or modify this software you should take the appropriate actions
 * to remove this software from your device immediately.
 */
import GuildChannel from "../../structures/guild/GuildChannel.ts";
import { MessageContent } from "../../structures/Message.ts";
import type { ApplicationCommandData, ApplicationData, ChannelData, ChannelEditOption, CreateWebhookData, EmbedData, ExecuteWebhookData, GuildData, GuildEditOptions, InteractionResponse, MessageConstructorData, MessageData, Snowflake, WebhookData } from "../common/Types.ts";
import Endpoints, { BASE_API_URL } from "./Endpoints.ts";
import RequestHandler from "./RequestHandler.ts";

class DiscordRequestHandler extends RequestHandler {
	/**
	 * Deletes a message from a channel
	 * @param channelId
	 * @param messageid
	 */
	public async deleteChannel(channelId: string): Promise<boolean> {
		const res: Response = await this.makeAndSend(Endpoints.channel(channelId), 'DELETE');
		return res.status === 200;
	}

	/**
	 * Edit a channel
	 * @param channelId 
	 * @param o 
	 */
	public async editChannel(channelId: string, o: ChannelEditOption): Promise<ChannelData> {
		const res: Response = await this.makeAndSend(Endpoints.channel(channelId), 'PATCH', {
			name: o.name,
			type: o.type,
			position: o.position,
			topic: o.topic,
			nsfw: o.nsfw,
			rate_limit_per_user: o.rateLimitPerUser,
			bitrate: o.bitrate,
			user_limit: o.userLimit,
			permission_overwrites: o.permissionsOverwrites,
			parent_id: o.parentID
		});
		return res.json()
	}

	/**
	 * Edit a guild
	 * @param guildId 
	 * @param o 
	 */
	public async editGuild(guildId: string, o: GuildEditOptions): Promise<GuildData> {
		const res: Response = await this.makeAndSend(Endpoints.guild(guildId), 'PATCH', {
			name: o.name,
			region: o.region,
			verification_level: o.verificationLevel,
			default_message_notifications: o.defaultMessageNotifications,
			explicit_content_filter: o.explicitContentFilter,
			afk_channel_id: o.afkChannelID,
			afk_timeout: o.afkTimeout,
			icon: o.icon,
			owner_id: o.ownerID,
			splash: o.splash,
			banner: o.banner,
			system_channel_id: o.systemChannelID,
			rules_channel_id: o.rulesChannelID,
			public_updates_channel_id: o.publicUpdatesChannelID,
			preferred_locale: o.preferredLocale
		});
		return res.json()
	}

	/**
	 * Deletes a message from a channel
	 * @param channelId
	 * @param messageid
	 */
	public async deleteMessage(channelId: string, messageid: string): Promise<boolean> {
		const res: Response = await this.makeAndSend(Endpoints.channel_messages(channelId, messageid), 'DELETE');
		return res.status === 200;
	}

	/**
	 * Deletes a message from a channel
	 * @param channelId
	 * @param messageid
	 */
	public async deleteMessages(channelId: string, messages: Snowflake<18>[]): Promise<boolean> {
		const res: Response = await this.makeAndSend(
			Endpoints.channel_messages(channelId) + '/bulk-delete',
			'POST',
			{ messages },
			[],
		);
		return res.status === 200;
	}

	/**
	 * Deletes a message from a channel
	 * @param channelId
	 * @param messageid
	 */
	public async editMessage(channelId: string, messageid: string, content: MessageConstructorData): Promise<MessageData> {
		const res: Response = await this.makeAndSend(Endpoints.channel_messages(channelId, messageid), 'PATCH', content, []);
		return res.json();
	}

	/**
	 * Creates a message in a channel
	 * @param channelId
	 * @param messageid
	 */
	public async createMessage(channelId: string, content: MessageContent): Promise<MessageData> {
		const res: Response = await this.makeAndSend(Endpoints.channel_messages(channelId), 'POST', content, []);
		return res.json();
	}

	/**
	 * Pins a message in a channel
	 * @param channelId
	 * @param messageId
	 */
	public async pinMessage(channelId: string, messageId: string): Promise<void> {
		await this.makeAndSend(Endpoints.channel_messages(channelId, messageId), 'PUT');
	}

	public async getChannel(channelId: string): Promise<ChannelData | false> {
		const res: Response = await this.makeAndSend(
			Endpoints.channel(channelId)
		);

		if (!res.ok) {
			return false;
		}
		
		return res.json();
	}

	public async getApplication(): Promise<ApplicationData|boolean> {
		const res: Response = await this.request(new Request(BASE_API_URL + Endpoints.discordApplication()));
		if (!res.ok) {
			return false;
		}
		return res.json();
	}

	public async getApplicationId(id: string): Promise<ApplicationData|boolean> {
		const res: Response = await this.request(new Request(BASE_API_URL + Endpoints.discordApplication(id)));
		if (!res.ok) {
			return false;
		}
		return res.json();
	}

	public async createAppGlobalCommand(id: string, command: ApplicationCommandData): Promise<ApplicationCommandData|false> {
		const res: Response = await this.makeAndSend(
			Endpoints.applicationCommand(id),
			'POST',
			command
		)

		if (!res.ok) {
			return false;
		}
		return res.json();
	}

	public async deleteAppGlobalCommand(id: string, command: ApplicationCommandData): Promise<ApplicationCommandData|false> {
		const res: Response = await this.makeAndSend(
			Endpoints.applicationCommand(id) + "/commands/" + command.id,
			'POST'
		)

		if (!res.ok) {
			return false;
		}
		return res.json();
	}

	public async createAppCommand(id: string, guild: string, command: ApplicationCommandData): Promise<ApplicationCommandData|false> {
		const res: Response = await this.makeAndSend(
			Endpoints.applicationCommandGuild(id, guild),
			'POST',
			command
		)

		if (!res.ok) {
			return false;
		}
		return res.json();
	}

	public async deleteAppCommand(id: string, guild: string, command: ApplicationCommandData): Promise<ApplicationCommandData|false> {
		const res: Response = await this.makeAndSend(
			Endpoints.applicationCommandGuild(id, guild),
			'POST'
		)

		if (!res.ok) {
			return false;
		}
		return res.json();
	}

	public async createInteractionResponse(id: string, token: string, data: InteractionResponse): Promise<boolean> {
		const res: Response = await this.makeAndSend(
			Endpoints.interactionResponse(id, token),
			"POST",
			data
		);

		if (!res.ok) {
			return false;
		} else {
			return true;
		}
	}

	public async createWebhook(data: CreateWebhookData): Promise<WebhookData> {
		const res: Response = await this.makeAndSend(
			Endpoints.createWehook(data.channel_id),
			'POST', 
			{name: data.name, avatar: data.avatar}
		);
		return res.json();
	}

	public async executeWebhook(id: string, token: string, data: ExecuteWebhookData): Promise<WebhookData> /** correct ? */ {
		const res: Response = await this.makeAndSend(
			Endpoints.executeWebhook(id, token),
			'POST',
			data
		);
		return res.json();
	}

	public async editWebhook(
		wID: string,
		token: string,
		mID: string, 
		data: {content: string, embeds?: EmbedData[], allowed_mentions?: ("roles" | "channels" | "members")[]}): Promise<WebhookData> /** correct ? */ {
		const res: Response = await this.makeAndSend(
			Endpoints.editWebhook(wID, token, mID),
			'PATCH',
			data
		);
		return res.json();
	}
}

export default DiscordRequestHandler;