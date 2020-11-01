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
import type * as Eris from "eris";
import type { EmbedField } from "eris";
import type Embed from "../util/Embed";
export declare type FunctionStringResponse = (...args: any[]) => Promise<string>;
export declare type DJSMsgType = "DEFAULT" | "RECIPIENT_ADD" | "RECIPIENT_REMOVE" | "CALL" | "CHANNEL_NAME_CHANGE" | "CHANNEL_ICON_CHANGE" | "PINS_ADD" | "GUILD_MEMBER_JOIN" | "USER_PREMIUM_GUILD_SUBSCRIPTION" | "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1" | "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2" | "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3" | "CHANNEL_FOLLOW_ADD" | "GUILD_DISCOVERY_DISQUALIFIED" | "GUILD_DISCOVERY_REQUALIFIED";
export interface BaseProps {
    id: string;
    createdAt?: number | Date;
}
export interface UserProps extends BaseProps {
    bot: boolean;
    username: string;
    discriminator: string;
    defaultAvatarURL: string | FunctionStringResponse;
    avatarURL: string;
    publicFlags?: number;
    flags?: any;
    system: boolean;
    game?: any | null;
    presence?: any;
}
export interface MemberProps extends BaseProps {
    user: UserProps;
    roles: Array<RoleProps | string>;
    joinedAt: number | Date;
    nick?: string | null;
    nickname?: string | null;
    permissions: any;
    guild: any;
    premiumSince: number | Date;
}
export interface RoleProps extends BaseProps {
}
interface MessageReference {
    channelID: string;
    guildID: string;
    messageID: string;
}
export interface MessageProps extends BaseProps {
    activity?: any;
    application?: any;
    attachments: any;
    author: UserProps;
    content: string;
    embeds: Array<Embed | EmbedProps>;
    channel: any;
    member: MemberProps | Eris.Member | null;
    mentions: UserProps[];
    pinned: boolean;
    reactions: {
        [s: string]: unknown;
        count: number;
        me: boolean;
    };
    timestamp?: number;
    createdTimestamp?: number;
    tts: boolean;
    type: number | DJSMsgType;
    messageReference?: MessageReference | null;
    reference?: MessageReference;
    webhookID?: string;
}
export interface EmbedProps {
    title?: string;
    type?: string | "rich" | "image" | "video" | "gifv" | "article" | "link";
    description?: string;
    url?: string;
    timestamp?: number | string | Date | undefined;
    color?: number;
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
        proxy_url?: string;
        height?: number;
        width?: number;
    };
    video?: {
        url?: string;
        height?: number;
        width?: number;
    };
    provider?: {
        name?: string;
        url?: string;
    };
    author?: {
        name: string;
        url?: string;
        icon_url?: string;
    };
    fields?: Array<{
        title?: string;
        description?: string;
        inline: boolean;
    } | EmbedField>;
}
export {};
