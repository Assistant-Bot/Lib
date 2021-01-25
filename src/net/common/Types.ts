/***
 *                    _     _              _
 *      /\           (_)   | |            | |
 *     /  \   ___ ___ _ ___| |_ __ _ _ __ | |_
 *    / /\ \ / __/ __| / __| __/ _` | "_ \| __|
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
import Member from "../../structures/guild/Member.ts";
import User from "../../structures/User.ts";

/**
 * HTTP status codes
 */
export type HTTPMethod =
	| "GET"
	| "HEAD"
	| "POST"
	| "PUT"
	| "DELETE"
	| "CONNECT"
	| "OPTIONS"
	| "TRACE"
	| "PATCH";

/**
 * Discord types
 */
export type Snowflake<Length> = string & {
	length: Length;
};

export type GatewayResponseBot = {
	url: string;
	shards: number;
	session_start_limit: {
		total: number;
		remaining: number;
		reset_after: number;
		max_concurrency: number;
	};
};

/**
 * Gateway types
 */
export interface BaseData {
	id: Snowflake<18>;
}

/**
 * User
 */
export type UserFlags =
	| 0 // None
	| 1 // Employee
	| 2 // Partner
	| 8 // Hysquad events
	| 64 // Bug hunter level 1
	| 128 // House, bravery
	| 256 // House brilliance
	| 512 // house balance
	| 1024 // early supporter
	| 2048 // team suer
	| 4096 // system
	| 16384 // bug hunter level 2
	| 65536 // verified bot
	| 131072; // early verfied bot developer

export type NitroType = 0 | 1 | 2;

export interface UserData extends BaseData {
	username: string;
	discriminator: string;
	avatar?: string;
	bot?: boolean;
	system?: boolean;
	mfa_enabled?: boolean;
	locale?: string;
	verified?: boolean;
	email?: string;
	flags?: UserFlags;
	premium_type?: NitroType;
	public_flags?: UserFlags;
}

/**
 * Guilds
 */
export interface GuildData extends BaseData {
	name: string;
	icon: string;
	icon_hash?: string;
	splash: string;
	discovery_splash: string;
	owner?: boolean; // We may not use ???
	owner_id: string;
	permissions: any; // We may not use ???
	region: any;
	afk_channel_id: string;
	afk_timeout: number;
	widget_enabled?: boolean;
	widget_channel_id?: string;
	verification_level: number;
	default_message_notifications: number;
	explicit_content_filter: number;
	roles: RoleData[];
	emojis: EmojiData[];
	features: any[];
	mfa_level: number; // We may not use ???
	application_id: string; // We may not use ???
	system_channel_id: string;
	system_channel_flags: number;
	rules_channel_id: string;
	joined_at?: string;
	large?: boolean;
	unavailable?: boolean;
	member_count?: number;
	voice_states?: any[];
	members?: MemberData[];
	channels?: ChannelData[];
	presences?: any[];
	max_presences?: number;
	max_members?: number;
	vanity_url_code?: string;
	description?: string;
	banner?: string;
	premium_tier: number;
	premium_subscription_count: number;
	preferred_locale: string;
	public_updates_channel_id: string;
	max_video_channel_users?: number;
	approximate_member_count?: number;
	approximate_presence_count?: number;
}
export type ChannelTypesNumeric = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type ChannelTypes =
	| "Text"
	| "DM"
	| "Voice"
	| "Group"
	| "Category"
	| "News"
	| "Store"
	| "Unknown";

export interface GuildEditOptions {
	name?: string;
	region?: string;
	verificationLevel?: string;
	defaultMessageNotifications?: string;
	explicitContentFilter?: string;
	afkChannelID?: string;
	afkTimeout?: string;
	icon?: string;
	ownerID?: string;
	splash?: string;
	banner?: string;
	systemChannelID?: string;
	rulesChannelID?: string;
	publicUpdatesChannelID?: string;
	preferredLocale?: string;
}

export interface GuildAuditLogData {
	webhooks: WebhookData[],
	users: UserData[],
	audit_log_entries: GuildAuditLogEntryData[],
	integrations: unknown[]
}

export interface GuildAuditLog {
	webhooks: WebhookData[];
	users: User[];
	entries: GuildAuditLogEntry[];
	integrations: unknown[]; // Add integrations later
}

export interface GuildAuditLogEntryData {
	id: string;
	target_id?: string;
	changes: GuildAuditLogEntryChange[]
	user_id: string;
	action_type: number;
	options?: GuildAuditLogEntryOptional,
	reason?: string;
}

export interface GuildAuditLogEntry {
	id: string;
	targetID?: string;
	changes: GuildAuditLogEntryChange[];
	userID: string;
	actionType: GuildAuditLogActionType;
	options?: GuildAuditLogEntryOptional;
	reason?: string;
}

export interface GuildAuditLogEntryOptional {
	delete_member_days?: string;
	members_removed?: string;
	channel_id: string;
	message_id: string;
	count: string;
	id: string;
	type: "0" | "1";
	role_name?: string;
}

export type GuildAuditLogEntryChangeKey =
	| "icon_hash"
	| "splash_hash"
	| "owner_id"
	| "region"
	| "afk_channel_id"
	| "afk_timeout"
	| "mfa_level"
	| "verification_level"
	| "explicit_content_filter"
	| "default_message_notifications"
	| "vanity_url_code"
	| "$add"
	| "$remove"
	| "prune_delete_days"
	| "widget_enabled"
	| "widget_channel_id"
	| "system_channel_id"
	| "position"
	| "topic"
	| "bitrate"
	| "permission_overwrites"
	| "nsfw"
	| "application_id"
	| "rate_limit_per_user"
	| "permissions"
	| "color"
	| "hoist"
	| "mentionable"
	| "allow"
	| "deny"
	| "code"
	| "channel_id"
	| "invite_id"
	| "max_users"
	| "uses"
	| "max_age"
	| "temporary"
	| "deaf"
	| "mute"
	| "nick"
	| "avatar_hash"
	| "id"
	| "enable_emoticons"
	| "expire_behavior"
	| "expire_grace_period";

export enum GuildAuditLogActionType {
	"GUILD_UPDATE" = 1,
	"CHANNEL_CREATE" = 10,
	"CHANNEL_UPDATE" = 11,
	"CHANNEL_DELETE" = 12,
	"CHANNEL_OVERWRITE_CREATE" = 13,
	"CHANNEL_OVERWRITE_UPDATE" = 14,
	"CHANNEL_OVERWRITE_DELETe" = 15,
	"MEMBER_KICK" = 20,
	"MEMBER_PRUNE" = 21,
	"MEMBER_BAN_ADD" = 22,
	"MEMBER_BAN_REMOVE" = 23,
	"MEMBER_UPDATE" = 24,
	"MEMBER_ROLE_UPDATE" = 25,
	"MEMBER_MOVE" = 26,
	"MEMBER_DISCONNECT" = 27,
	"BOT_ADD" = 28,
	"ROLE_CREATE" = 30,
	"ROLE_UPDATE" = 31,
	"ROLE_DELETE" = 32,
	"INVITE_CREATE" = 40,
	"INVITE_UPDATE" = 41,
	"INVITE_DELETE" = 42,
	"WEBHOOK_CREATE" = 50,
	"WEBHOOK_UPDATE" = 51,
	"WEBHOOK_DELETE" = 52,
	"EMOJI_CREATE" = 60,
	"EMOJI_UPDATE" = 61,
	"EMOJI_DELETE" = 62,
	"MESSAGE_DELETE" = 72,
	"MESSAGE_BULK_DELETE" = 73,
	"MESSAGE_PIN" = 74,
	"MESSAGE_UNPIN" = 75,
	"INTEGRATION_CREATE" = 80,
	"INTEGRATION_UPDATE" = 81,
	"INTEGRATION_DELETE" = 82,
}

export interface GuildAuditLogEntryChange {
	new_value?: AnyStructureData | AnyStructureData[] | string | number | boolean; // Change this later
	old_value?: AnyStructureData | AnyStructureData[] | string | number | boolean; // Change this later
	key: GuildAuditLogEntryChangeKey;
}

export interface GuildAuditLogQueryParams {
	userID?: string,
	actionType?: number,
	before?: string,
	limit?: number
}

/** Channels */
export interface PermissionOverwrites extends BaseData {
	type: 0 | 1; // 0 (role) or 1 (member)
	allow: number;
	deny: number;
}

export interface PartialChannelData extends BaseData {
	type: ChannelTypesNumeric;
	name?: string;
}

export interface ChannelData extends BaseData {
	type: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	name?: string;
	guild_id?: string;
	position?: number;
	permission_overwrites?: PermissionOverwrites[];
	topic?: string;
	nsfw?: boolean;
	last_message_id?: string;
	bitrate?: number;
	user_limit?: number;
	rate_limit_per_user?: number;
	recipients?: UserData[];
	icon?: string;
	owner_id?: string;
	application_id?: string;
	parent_id?: string;
	last_pin_timestamp?: string;
}

export interface ChannelEditOption {
	name?: string;
	type?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	position?: number;
	topic?: string;
	nsfw?: boolean;
	rateLimitPerUser?: number;
	bitrate?: number;
	userLimit?: number;
	permissionsOverwrites?: PermissionOverwrites[];
	parentID?: string;
}

export type ChannelCreateOption = ChannelEditOption;

/** Role */
export interface RoleData extends BaseData {
	name: string;
	color: number;
	hoist: boolean;
	position: number;
	permissions: string;
	managed: boolean;
	mentionable: boolean;
}

export interface RoleEditOptions {
	name?: string;
	permissions?: string;
	color?: number;
	hoist?: boolean;
	mentionable?: boolean;
}

export type RoleCreateOptions = RoleEditOptions;

/** Member */
export interface MemberData extends BaseData {
	user?: UserData;
	nick?: string;
	roles: string[];
	joined_at: string;
	premium_since?: string;
	deaf: boolean;
	mute: boolean;
}

/** Messages */
export interface AttachmentData extends BaseData {
	filename: string;
	size: number;
	url: string;
	proxy_url: string;
	height?: number;
	width?: number;
}

export interface EmbedData {
	title?: string;
	type?: "rich" | "image" | "video" | "gifv" | "article" | "link";
	description?: string;
	url?: string;
	timestamp?: string;
	color?: string;
	footer?: {
		text: string;
		icon_url?: string;
		proxy_icon_url?: string;
	};
	image?: {
		url?: string;
		proxy_url?: string;
		height?: number;
		width?: number;
	};
	thumbnail?: {
		url?: string;
		height?: number;
		width?: number;
	};
	video?: {
		url?: string;
		width?: number;
		height?: number;
	};
	provider?: {
		name?: string;
		url?: string;
	};
	author: {
		name?: string;
		url?: string;
		icon_url?: string;
		proxy_icon_url?: string;
	};
	fields: Array<{
		name: string;
		value: string;
		inline?: boolean;
	}>;
}

export enum MessageType {
	DEFAULT = 0,
	RECIPIENT_ADD = 1,
	RECIPIENT_REMOVE = 2,
	CALL = 3,
	CHANNEL_NAME_CHANGE = 4,
	CHANNEL_ICON_CHANGE = 5,
	CHANNEL_PINNED_MESSAGE = 6,
	GUILD_MEMBER_JOIN =	7,
	USER_PREMIUM_GUILD_SUBSCRIPTION = 8,
	USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1 = 9,
	USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2 = 10,
	USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3 = 11,
	CHANNEL_FOLLOW_ADD = 12,
	GUILD_DISCOVERY_DISQUALIFIED = 14,
	GUILD_DISCOVERY_REQUALIFIED = 15,
	REPLY =	19,
	APPLICATION_COMMAND = 20
}

export interface MessageData extends BaseData {
	channel_id: string;
	guild_id?: string;
	author: UserData;
	member?: MemberData;
	content: string;
	timestamp: string;
	edited_timestamp: string | null;
	tts: boolean;
	mention_everyone: boolean;
	mentions: Array<UserData | Partial<MemberData>>;
	mention_roles: RoleData[];
	mention_channels?: ChannelData[];
	attachments: AttachmentData[];
	embed?: EmbedData;
	embeds: EmbedData[];
	reactions?: ReactionData[];
	nonce?: number | string;
	pinned: boolean;
	webhook_id?: string;
	type: MessageType;
	activity?: {
		type: 1 | 2 | 3 | 5;
		party_id?: string;
	};
	application?: {
		id: string;
		cover_image?: string;
		description: string;
		icon?: string;
		name: string;
	};
	message_reference?: {
		message_id?: string;
		channel_id?: string;
		guild_id?: string;
	};
	flags?: number;
	stickers?: MessageStickerData[];
	referenced_message?: Partial<MessageData> | null;
}

export interface MessageStickerData extends BaseData {
	pack_id: string;
	name: string;
	description: string;
	tags?: string;
	asset?: string;
	preview_asset?: string;
	/**
	 * 1 - PNG
	 * 2 - Animated PNG
	 * 3 - LOTTIE (lol?)
	 */
	format_type: 1 | 2 | 3;
}

export interface MessageConstructorData {
	content: string;
	embed?: EmbedData;
	flags?: number;
}

export interface ReactionData {
	count: number;
	me: boolean;
	emoji: Partial<EmojiData>;
}

/** Emoji */
export interface EmojiData {
	id: string | null;
	name: string | null;
	roles?: string[];
	user?: Partial<UserData>;
	require_colons?: boolean;
	managed?: boolean;
	animated?: boolean;
	available?: boolean;
}

/**
 * Invites
 */
export interface InviteData {
	code: string;
	channel: PartialChannelData;
	guild?: Partial<GuildData>;
	inviter?: Partial<UserData>;
	target_user?: Partial<UserData>;
	target_user_type?: 1;
	approximate_presence_count?: number;
	approximate_member_count?: number;
}

export interface InviteMetadata {
	uses: number;
	max_uses: number;
	max_age: number;
	temporary: boolean;
	created_at: string;
}

export interface InviteCreateOptions {
	maxAge?: number;
	maxUses?: number;
	temporary?: boolean;
	unique?: boolean;
	targetUser?: string;
	targetUserType?: number;
}

/** Applications */
export interface ApplicationData {
	name: string;
	icon: string;
	description: string;
	rpc_origins?: string[];
	bot_public: boolean;
	bot_require_code_grant: boolean;
	owner: UserData;
	summary: string;
	verify_key: string;
	team?: any;
	guild_id?: string;
	primary_sku_id?: string;
	slug?: string;
	cover_image?: string;
}

// command stuff
export enum ApplicationOptionType {
	SUB_COMMAND = 1,
	SUB_COMMAND_GROUP = 2,
	STRING = 3,
	INTEGER = 4,
	BOOLEAN = 5,
	USER = 6,
	CHANNEL = 7,
	ROLE = 8,
}

export interface ApplicationCommandChoice {
	name: string;
	value: string | number;
}

export interface ApplicationCommandOption {
	name: string;
	description: string;
	type: ApplicationOptionType;
	default?: boolean;
	required?: boolean;
	choices?: ApplicationCommandChoice[];
	options?: ApplicationCommandOption;
}

export interface ApplicationCommandData {
	id?: string;
	application_id?: string;
	name: string;
	description: string;
	options?: ApplicationCommandOption[];
}

export interface InteractionDataOption {
	/** The name of the parammeter */
	name: string;
	/** The value of the pair */
	value?: any;
	/** Present if this option is a group or subcommand */
	options?: InteractionDataOption[];
}

export interface InteractionData {
	name: string;
	id: string;
	options?: InteractionDataOption[];
}

export interface InteractionDataRecieve {
	/** id of the command */
	id: string;
	name: string;
	member: MemberData;
	type: ApplicationOptionType;
	token: string;
	guild_id: string;
	channel_id: string;
	mentions: any[];
	mention_everyone: boolean;
	data: InteractionData;
}

export interface InteractionResponse {
	/** The type of response */
	type: InteractionResponseType;
	/** The optional response message */
	data?: ApplicationCommandCallbackData;
}

export interface ApplicationCommandCallbackData {
	tts?: boolean;
	content: string;
	embeds?: EmbedData[];
	allowed_mentions?: "roles" | "users" | "everyone";
	flags?: number;
}

export enum InteractionType {
	PING = 1,
	APPLICATION_COMMAND = 2,
}

export enum InteractionResponseType {
	PONG = 1,
	ACKNOWLEDGE = 2,
	CHANNEL_MESSAGE = 3,
	CHANNEL_MESSAGE_WITH_SOURCE = 4,
	ACK_WITH_SOURCE = 5,
}

export interface WebhookData {
	id: string;
	type: 1 | 2;
	guild_id: string;
	channel_id: string;
	user?: User;
	name: string;
	avatar: string;
	token?: String;
	application_id: string;
}

export interface CreateWebhookData {
	name: string;
	avatar?: string;
	channel_id: string;
}

export interface ExecuteWebhookData {
	content: string;
	username?: string;
	avatar_url?: string;
	tts?: boolean;
	file?: Uint8Array; //??
	embeds: EmbedData[];
	payload_json?: string;
	allowed_mentions?: ("roles" | "channels" | "members")[];
}

export interface VoiceState {
	guild_id?: string;
	channel_id?: string;
	user_id: string;
	member?: Member;
	session_id: string;
	deaf: boolean;
	mute: boolean;
	self_deaf: boolean;
	self_mute: boolean;
	self_stream: boolean;
	self_video: boolean;
	suppress: boolean;
}

/** Generalized Types */
export type AnyStructureData =
	| ApplicationData
	| UserData
	| UserFlags
	| MessageData
	| GuildData
	| PermissionOverwrites
	| PartialChannelData
	| MessageStickerData
	| ReactionData
	| EmbedData
	| AttachmentData
	| RoleData
	| MemberData
	| InviteData
	| InviteMetadata
	| EmojiData
	| ApplicationCommandData;
