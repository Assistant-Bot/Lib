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
	length: Length
};

export type GatewayResponseBot = {
	url: string,
	shards: number,
	session_start_limit: {
		total: number,
		remaining: number,
		reset_after: number,
		max_concurrency: number
	}
}

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
	permissions: any // We may not use ???
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
	mfa_level: number // We may not use ???
	application_id: string // We may not use ???
	system_channel_id: string;
	system_channel_flags: number;
	rules_channel_id: string;
	joined_at?: string;
	large?: boolean;
	unavailable?: boolean
	member_count?: number;
	voice_states?: any[];
	members?: MemberData[];
	channels?: ChannelData[];
	presences?: any[];
	max_presences?: number
	max_members?: number
	vanity_url_code?: string;
	description?: string;
	banner?: string;
	premium_tier: number;
	premium_subscription_count: number;
	preferred_locale: string;
	public_updates_channel_id: string;
	max_video_channel_users?: number;
	approximate_member_count?: number;
	approximate_presence_count?: number
}
export type ChannelTypesNumeric = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type ChannelTypes = "Text" | "DM" | "Voice" | "Group" | "Category" | "News" | "Store" | "Unknown";


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
	}
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
	}>
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
	embeds: EmbedData[];
	reactions?: ReactionData[];
	nonce?: number | string;
	pinned: boolean;
	webhook_id?: string;
	type: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 19;
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
	guild?: string;
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
export interface ApplicationCommandChoice {
	name: string;
	value: string | number;
}

export interface ApplicationCommandOption {
	name: string;
	description: string;
	type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
	default?: boolean;
	required?: boolean;
	choices?: ApplicationCommandChoice[];
	options?: ApplicationCommandOption
}

export interface ApplicationCommandData {
	id?: string;
	application_id?: string;
	name: string;
	description: string;
	options?: ApplicationCommandOption[];
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