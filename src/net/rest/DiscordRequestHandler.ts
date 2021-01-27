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
import Emoji from "../../structures/guild/Emoji.ts";
import { MessageContent } from '../../structures/Message.ts';
import { isOkay } from "../../util/Miscellaneous.ts";
import type {
	ApplicationCommandData,
	ApplicationData,
	ChannelData,
	ChannelEditOption,
	CreateWebhookData,
	EmbedData,
	ExecuteWebhookData,
	GuildData,
	GuildEditOptions,
	InteractionResponse,
	InviteCreateOptions,
	InviteData,
	MessageConstructorData,
	MessageData,
	RoleEditOptions,
	RoleData,
	Snowflake,
	WebhookData,
	GuildAuditLog,
	GuildAuditLogData,
	GuildAuditLogActionType,
} from '../common/Types.ts';
import Endpoints, { BASE_API_URL } from './Endpoints.ts';
import RequestHandler from './RequestHandler.ts';

class DiscordRequestHandler extends RequestHandler {
	public async createChannel(guildId: string, opts: ChannelEditOption): Promise<ChannelData> {
		const res: Response = await this.makeAndSend(
			Endpoints.guild_channels(guildId),
			'POST',
			{
				name: opts.name,
				type: opts.type,
				position: opts.position,
				topic: opts.topic,
				nsfw: opts.nsfw,
				rate_limit_per_user: opts.rateLimitPerUser,
				bitrate: opts.bitrate,
				user_limit: opts.userLimit,
				permission_overwrites: opts.permissionsOverwrites,
				parent_id: opts.parentID,
			}
		);
		return res.json();
	}

	/**
	 * Deletes a message from a channel
	 * @param channelId
	 * @param messageid
	 */
	public async deleteChannel(channelId: string): Promise<boolean> {
		const res: Response = await this.makeAndSend(
			Endpoints.channel(channelId),
			'DELETE'
		);
		return res.status === 200;
	}

	/**
	 * Edit a channel
	 * @param channelId
	 * @param o
	 */
	public async editChannel(
		channelId: string,
		opts: ChannelEditOption
	): Promise<ChannelData> {
		const res: Response = await this.makeAndSend(
			Endpoints.channel(channelId),
			'PATCH',
			{
				name: opts.name,
				type: opts.type,
				position: opts.position,
				topic: opts.topic,
				nsfw: opts.nsfw,
				rate_limit_per_user: opts.rateLimitPerUser,
				bitrate: opts.bitrate,
				user_limit: opts.userLimit,
				permission_overwrites: opts.permissionsOverwrites,
				parent_id: opts.parentID,
			}
		);
		return res.json();
	}

	public async editChannelPosition(
		guildId: string,
		channelId: string,
		pos: number
	): Promise<void> {
		const res: Response = await this.makeAndSend(
			Endpoints.guild_channels(guildId),
			'PATCH',
			{
				id: channelId,
				position: pos,
			}
		);
		return res.json();
	}

	public async editChannelPermission(
		channelId: string,
		overwriteId: string,
		opts: { allow: string; deny: string; type: 'member' | 'role' }
	): Promise<void> {
		const res: Response = await this.makeAndSend(
			Endpoints.channel_permission(channelId, overwriteId),
			'PUT',
			{
				allow: opts.allow,
				deny: opts.deny,
				type: opts.type === 'member' ? 1 : 0,
			}
		);
		return res.json();
	}

	public async deleteChannelPermission(
		channelId: string,
		overwriteId: string
	): Promise<void> {
		const res: Response = await this.makeAndSend(
			Endpoints.channel_permission(channelId, overwriteId),
			'DELETE'
		);
		return res.json();
	}

	public async getChannelInvites(channelId: string): Promise<InviteData[]> {
		const res: Response = await this.makeAndSend(
			Endpoints.channel_invites(channelId),
			'GET'
		);
		return res.json();
	}

	public async getGuildInvites(guildId: string): Promise<InviteData[]> {
		const res: Response = await this.makeAndSend(
			Endpoints.guild_invites(guildId),
			'GET'
		);
		return res.json();
	}

	public async createChannelInvites(
		channelId: string,
		opts?: InviteCreateOptions
	): Promise<InviteData> {
		const res: Response = await this.makeAndSend(
			Endpoints.channel_invites(channelId),
			'GET',
			opts ? {
					max_age: opts.maxAge,
					max_uses: opts.maxUses,
					temporary: opts.temporary,
					unique: opts.unique,
					target_user: opts.targetUser,
					target_user_type: opts.targetUserType,
			} : {}
		);
		return res.json();
	}

	public async getChannelPins(channelId: string): Promise<MessageData[]> {
		const res: Response = await this.makeAndSend(
			Endpoints.channel_pins(channelId),
			'GET'
		);
		return res.json();
	}

	public async addPinChannelMessage(
		channelId: string,
		msgId: string
	): Promise<void> {
		const res: Response = await this.makeAndSend(
			Endpoints.channel_pin(channelId, msgId),
			'POST'
		);
		return res.json();
	}

	public async deletePinChannelMessage(
		channelId: string,
		msgId: string
	): Promise<void> {
		const res: Response = await this.makeAndSend(
			Endpoints.channel_pin(channelId, msgId),
			'DELETE'
		);
		return res.json();
	}

	public async createReaction(
		channelId: string,
		msgId: string,
		emojiId: string | Emoji
	): Promise<boolean> {
		if (emojiId instanceof Emoji) {
			emojiId = emojiId.id;
		}
		const res: Response = await this.makeAndSend(
			Endpoints.me_reaction(channelId, msgId, emojiId),
			'PUT'
		);
		return isOkay(res.status);
	}

	public async deleteMeReaction(
		channelId: string,
		msgId: string,
		emojiId: string | Emoji
	): Promise<boolean> {
		if (emojiId instanceof Emoji) {
			emojiId = emojiId.id;
		}
		const res: Response = await this.makeAndSend(
			Endpoints.me_reaction(channelId, msgId, emojiId),
			'DELETE'
		)
		return isOkay(res.status);
	}

	public async deleteUserReaction(
		channeld: string,
		msgId: string,
		emojiId: string,
		userId: string
	): Promise<boolean> {
		const res: Response = await this.makeAndSend(
			Endpoints.user_reaction(channeld, msgId, emojiId, userId),
			'DELETE'
		);
		return isOkay(res.status);
	}

	public async deleteAllReactions(
		channelId: string,
		msgId: string
	): Promise<void> {
		const res: Response = await this.makeAndSend(
			Endpoints.message_reactions(channelId, msgId),
			'DELETE'
		);
		return res.json();
	}

	public async deleteAllReactionsEmoji(
		channelId: string,
		msgId: string,
		emojiId: string
	): Promise<void> {
		const res: Response = await this.makeAndSend(
			Endpoints.message_reaction(channelId, msgId, emojiId),
			'DELETE'
		);
		return res.json();
	}

	public async startTyping(channelId: string): Promise<void> {
		const res: Response = await this.makeAndSend(
			Endpoints.typing_indicator(channelId),
			'POST'
		);
		return res.json();
	}

	/**
	 * Edit a guild
	 * @param guildId
	 * @param o
	 */
	public async editGuild(
		guildId: string,
		opts: GuildEditOptions
	): Promise<GuildData> {
		const res: Response = await this.makeAndSend(
			Endpoints.guild(guildId),
			'PATCH',
			{
				name: opts.name,
				region: opts.region,
				verification_level: opts.verificationLevel,
				default_message_notifications: opts.defaultMessageNotifications,
				explicit_content_filter: opts.explicitContentFilter,
				afk_channel_id: opts.afkChannelID,
				afk_timeout: opts.afkTimeout,
				icon: opts.icon,
				owner_id: opts.ownerID,
				splash: opts.splash,
				banner: opts.banner,
				system_channel_id: opts.systemChannelID,
				rules_channel_id: opts.rulesChannelID,
				public_updates_channel_id: opts.publicUpdatesChannelID,
				preferred_locale: opts.preferredLocale,
			}
		);
		return res.json();
	}

	public async getAuditLogs(guildId: string, opt?: {
		user_id?: string,
		action_type?: GuildAuditLogActionType,
		before?: number,
		limit?: number
	}): Promise<GuildAuditLogData> {
		const $params = {};
		if (opt) {
			for (let i of Object.keys(opt as Object)) {
				// @ts-ignore
				if (!opt[i]) {
					continue;
				}

				// @ts-ignore
				$params[i] = opt[i];
			}
		}
		const res: Response = await this.makeAndSend(
			Endpoints.guild_audit_logs(guildId),
			'GET',
			{
				$params
			}
		);
		return res.json();
	}

	public async createRole(
		guildId: string,
		opts: RoleEditOptions
	): Promise<RoleData> {
		const res: Response = await this.makeAndSend(
			Endpoints.guild_roles(guildId),
			'POST',
			opts
		);
		return res.json();
	}

	public async editRole(
		guildId: string,
		roleId: string,
		opts: RoleEditOptions
	): Promise<RoleData> {
		const res: Response = await this.makeAndSend(
			Endpoints.guild_role(guildId, roleId),
			'PATCH',
			opts
		);
		return res.json();
	}

	public async getMessages(
		channelId: string,
		limit: number = 50,
		params?: { around?: number; before?: number; after?: number }
	): Promise<MessageData[]> {
		const res: Response = await this.makeAndSend(
			Endpoints.channel_messages(channelId),
			'GET',
			{
				$params: {
					limit: limit,
					around: params?.around,
					before: params?.before,
					after: params?.after,
				}
			}
		);
		return res.json();
	}

	/**
	 * Deletes a message from a channel
	 * @param channelId
	 * @param messageid
	 */
	public async deleteMessage(
		channelId: string,
		messageid: string
	): Promise<boolean> {
		const res: Response = await this.makeAndSend(
			Endpoints.channel_messages(channelId, messageid),
			'DELETE'
		);
		return res.status === 200;
	}

	/**
	 * Deletes a message from a channel
	 * @param channelId
	 * @param messageid
	 */
	public async deleteMessages(
		channelId: string,
		messages: Snowflake<18>[]
	): Promise<boolean> {
		const res: Response = await this.makeAndSend(
			Endpoints.channel_messages(channelId) + '/bulk-delete',
			'POST',
			{ messages },
			[]
		);
		return res.status === 200;
	}

	/**
	 * Deletes a message from a channel
	 * @param channelId
	 * @param messageid
	 */
	public async editMessage(
		channelId: string,
		messageid: string,
		content: MessageConstructorData
	): Promise<MessageData> {
		const res: Response = await this.makeAndSend(
			Endpoints.channel_messages(channelId, messageid),
			'PATCH',
			content,
			[]
		);
		return res.json();
	}

	/**
	 * Creates a message in a channel
	 * @param channelId
	 * @param messageid
	 */
	public async createMessage(
		channelId: string,
		content: MessageContent
	): Promise<MessageData> {
		const res: Response = await this.makeAndSend(
			Endpoints.channel_messages(channelId),
			'POST',
			content,
			[]
		);
		return res.json();
	}

	/**
	 * Pins a message in a channel
	 * @param channelId
	 * @param messageId
	 */
	public async pinMessage(
		channelId: string,
		messageId: string
	): Promise<void> {
		await this.makeAndSend(
			Endpoints.channel_messages(channelId, messageId),
			'PUT'
		);
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

	public async getApplication(): Promise<ApplicationData | boolean> {
		const res: Response = await this.request(
			new Request(BASE_API_URL + Endpoints.discordApplication())
		);
		if (!res.ok) {
			return false;
		}
		return res.json();
	}

	public async getApplicationId(
		id: string
	): Promise<ApplicationData | boolean> {
		const res: Response = await this.request(
			new Request(BASE_API_URL + Endpoints.discordApplication(id))
		);
		if (!res.ok) {
			return false;
		}
		return res.json();
	}

	public async createAppGlobalCommand(id: string, command: ApplicationCommandData): Promise<ApplicationCommandData | false> {
		const res: Response = await this.makeAndSend(
			Endpoints.applicationCommand(id),
			'POST',
			command
		);

		if (!res.ok) {
			return false;
		}
		return res.json();
	}

	public async deleteAppGlobalCommand(id: string, command: ApplicationCommandData): Promise<ApplicationCommandData | false> {
		const res: Response = await this.makeAndSend(
			Endpoints.applicationCommand(id) + '/commands/' + command.id,
			'POST'
		);

		if (!res.ok) {
			return false;
		}
		return res.json();
	}

	public async createAppCommand(
		id: string,
		guild: string,
		command: ApplicationCommandData
	): Promise<ApplicationCommandData | false> {
		const res: Response = await this.makeAndSend(
			Endpoints.applicationCommandGuild(id, guild),
			'POST',
			command
		);

		if (!res.ok) {
			return false;
		}
		return res.json();
	}

	public async deleteAppCommand(
		id: string,
		guild: string,
		command: ApplicationCommandData
	): Promise<ApplicationCommandData | false> {
		const res: Response = await this.makeAndSend(
			Endpoints.applicationCommandGuild(id, guild),
			'POST'
		);

		if (!res.ok) {
			return false;
		}
		return res.json();
	}

	public async createInteractionResponse(
		id: string,
		token: string,
		data: InteractionResponse
	): Promise<boolean> {
		const res: Response = await this.makeAndSend(
			Endpoints.interactionResponse(id, token),
			'POST',
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
			{ name: data.name, avatar: data.avatar }
		);
		return res.json();
	}

	public async deleteWebhook(id: string, token: string): Promise<Response> {
		return await this.makeAndSend(
			Endpoints.executeWebhook(id, token),
			'DELETE'
		);
	}

	public async executeWebhook(
		id: string,
		token: string,
		data: ExecuteWebhookData
	): Promise<Response> {
		return await this.makeAndSend(
			Endpoints.executeWebhook(id, token),
			'POST',
			data
		);
	}

	public async editWebhook(
		wID: string,
		token: string,
		mID: string,
		data: {
			content: string;
			embeds?: EmbedData[];
			allowed_mentions?: ('roles' | 'channels' | 'members')[];
		}
	): Promise<WebhookData> /** correct ? */ {
		const res: Response = await this.makeAndSend(
			Endpoints.editWebhook(wID, token, mID),
			'PATCH',
			data
		);
		return res.json();
	}
}

export default DiscordRequestHandler;