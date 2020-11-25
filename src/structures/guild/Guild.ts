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
import Client from "../../Client.ts";
import { GuildData } from "../../net/common/Types.ts";
import Collection from "../../util/Collection.ts";
import Base from "../Base.ts";
import GuildChannel from "../guild/GuildChannel.ts";
import Emoji from "./Emoji.ts";
import Member from "./Member.ts";
import Role from "./Role.ts";

export default class Guild extends Base {
    public name!: string;
    public icon!: string;
    public splash?: string;
    public discoverySplash?: string;
    public ownerID!: string;
    public region: any;
    public afkChannelID?: string;
    public afkTimeout!: number;
    public widgetEnabled?: boolean;
    public widgetChannelID?: string;
    public verificationLevel!: number;
    public defaultMessageNotifications!: number;
    public explicitContentFilter!: number;
    public features!: any[];
    public mfaLevel!: number;
    public systemChannelID?: string;
    public systemChannelFlags?: number;
    public joinedAt?: string;
    public large?: boolean;
    public unavailable?: boolean;
    public memberCount?: number;
    public voiceStates?: any[];
    public presences?: any[];
    public maxPresences?: number;
    public maxMembers?: number;
    public vanityURLCode?: string;
    public description?: string;
    public banner?: string;
    public premiumTier!: number;
    public subscriptionCount!: number;
    public locale!: string;
    public publicUpdatesChannelID?: string;
    public maxVideoChannelUsers?: number;
    
    
	public channels!: Collection<string, GuildChannel>;
	public roles!: Collection<string, Role>;
	public members!: Collection<string, Member>;
	public emojis!: Collection<string, Emoji>;

	public constructor(client: Client, data: GuildData) {
        super(client, data.id); 
        this.update(data);
    }
    
    public update(data: GuildData) {
        this.name = data.name;
        this.icon = data.icon;
        this.splash = data.splash;
        this.discoverySplash = data.discovery_splash;
        this.region = data.region;
        this.ownerID = data.owner_id;
        this.memberCount = data.member_count;
        this.afkChannelID = data.afk_channel_id
        this.afkTimeout = data.afk_timeout
        this.verificationLevel = data.verification_level;
        this.defaultMessageNotifications = data.default_message_notifications;
        this.systemChannelID = data.system_channel_id;
        this.systemChannelFlags =  data.system_channel_flags
        this.explicitContentFilter = data.explicit_content_filter;
        this.features = data.features;
        this.mfaLevel = data.mfa_level;
        this.joinedAt = data.joined_at;
        this.large = data.large;
        this.voiceStates = data.voice_states;
        this.presences = data.presences;
        this.memberCount = data.member_count;
        this.maxMembers = data.max_members;
        this.maxPresences = data.max_presences;
        this.vanityURLCode = data.vanity_url_code;
        this.description = data.description;
        this.banner = data.banner;
        this.premiumTier   = data.premium_tier;
        this.subscriptionCount = data.premium_subscription_count;
        this.maxVideoChannelUsers = data.max_video_channel_users;
        if(data.channels) {
            for(let _ of data.channels) {
                const ch = new GuildChannel(this.client, _);
                this.channels.set(ch.id, ch);
            }
        }
        if(data.roles) {
            for(let _ of data.roles) {
                const r = new Role(this.client, _);
                this.roles.set(r.id, r);
            }
        }
        if(data.members) {
            for(let _ of data.members) {
                const m = new Member(this.client, _);
                this.members.set(m.id, m)
            }
        }
        if(data.emojis) {
            for(let _ of data.emojis) {
                const e = new Emoji(this.client, _);
                this.emojis.set(e.id, e);
            }
        }

    }
}