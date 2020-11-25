/***
 *                    _     _              _
 *      /\           (_)   | |            | |
 *     /  \   ___ ___ _ ___| |_ __ _ _ __ | |_
 *    / /\ \ / __/ __| / __| __/ _` | '_ \| __|
 *   / ____ \\__ \__ \ \__ \ || (_| | | | | |_
 *  /_/    \_\___/___/_|___/\__\__,_|_| |_|\__|
 *
 * Copyright (C) 2020 John Bergman
 *
 * This is private software, you cannot redistribute and/or modify it in any way
 * unless given explicit permission to do so. If you have not been given explicit
 * permission to view or modify this software you should take the appropriate actions
 * to remove this software from your device immediately.
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
    type: 0 | 1 | 3 | 4 | 5 | 6;
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
export interface MemberData {
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

export interface MessageStickerData {

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

/** Generalized Types */
export type AnyStructureData =
    | UserData
    | UserFlags
    | MessageData
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
    | EmojiData;