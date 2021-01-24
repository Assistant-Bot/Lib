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
import type Client from "../../Client.ts";
import type { ChannelEditOption, ChannelData, GuildData, GuildEditOptions, RoleEditOptions, RoleData, InviteData, GuildAuditLog, GuildAuditLogEntry } from "../../net/common/Types.ts";
import Collection from "../../util/Collection.ts";
import Base from "../Base.ts";
import GuildChannel from "../guild/GuildChannel.ts";
import CategoryChannel from "./CategoryChannel.ts";
import Emoji from "./Emoji.ts";
import Member from "./Member.ts";
import NewsChannel from "./NewsChannel.ts";
import Role from "./Role.ts";
import StoreChannel from "./StoreChannel.ts";
import TextChannel from "./TextChannel.ts";
import VoiceChannel from "./VoiceChannel.ts";
import Invite from './Invite.ts';
import User from "../User.ts";

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
	public roles: Collection<string, Role>;
	public members: Collection<string, Member>;
	public emojis: Collection<string, Emoji>;

	// for reference
	#boundChannels: Set<string>;

	public constructor(client: Client, data: GuildData) {
		super(client, data.id);
		this.members = new Collection();
		this.roles = new Collection();
		this.emojis = new Collection();
		this.#boundChannels = new Set();
		this.update(data);
	}

	public update(data: GuildData): void {
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
		this.systemChannelFlags = data.system_channel_flags
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
		this.premiumTier = data.premium_tier;
		this.subscriptionCount = data.premium_subscription_count;
		this.maxVideoChannelUsers = data.max_video_channel_users;

		if (data.channels) {
			for (let _ of data.channels) {
				_.guild_id = this.id;
				let ch: GuildChannel;
				switch(_.type) {
					case 0:
						ch = new TextChannel(this.client, _);
						break;
					case 2:
						ch = new VoiceChannel(this.client, _);
						break;
					case 4:
						ch = new CategoryChannel(this.client, _);
						break;
					case 5:
						ch = new NewsChannel(this.client, _);
						break;
					case 6:
						ch = new StoreChannel(this.client, _);
						break;
					default:
						ch = new GuildChannel(this.client, _);
						break;
				}
				this.client.dataManager?.channels.set(ch.id, ch);
				this.#boundChannels.add(ch.id);
			}
		}

		if (data.roles) {
			for (let _ of data.roles) {
				const r = new Role(this.client, _);
				this.roles.set(r.id, r);
			}
		}

		if (data.members) {
			for (let _ of data.members) {
				const m = new Member(this.client, _);
				this.members.set(m.id, m)
			}
		}

		if (data.emojis) {
			for (let _ of data.emojis) {
				const e = new Emoji(this.client, _);
				this.emojis.set(e.id, e);
			}
		}
		this.client.dataManager?.guilds.set(this.id, this);
	}

	public async getInvites(): Promise<Invite[]> {
		const inviteData: InviteData[] = await this.request.getGuildInvites(this.id);
		const invites: Invite[] = [];

		for (let inv of inviteData) {
			invites.push(new Invite(this.client, inv));
		}
		return invites;
	}

	public async getAuditLogs(): Promise<GuildAuditLog> {
		const data = await this.request.getAuditLogs(this.id);
		return {
			entries: data.audit_log_entries.map(a => {
				return {
					id: a.id,
					userID: a.user_id,
					targetID: a.target_id,
					actionType: a.action_type,
					changes: a.changes,
					options: a.options,
					reason: a.reason
				}
			}),
			integrations: data.integrations,
			users: data.users.map(u => new User(this.client, u)),
			webhooks: data.webhooks
		}
	}

	public async edit(o: GuildEditOptions) {
		const gData = await this.request.editGuild(this.id, o);
		const g = new Guild(this.client, gData);
		this.client.dataManager?.guilds.set(g.id, g);
		return g;
	}

	public get channels(): GuildChannel[] {
		const arr: GuildChannel[] = [];
		for (let id of this.#boundChannels) {
			// todo refactor
			// make asyncable
			arr.push(this.client.dataManager?.channels.get(id));
		}
		return arr.filter(c => c !== undefined);
	}

	public async createChannel(o: ChannelEditOption) {
		const res: ChannelData = await this.request.createChannel(this.id, o);
		return new GuildChannel(this.client, res);
	}

	public async createRole(o: RoleEditOptions) {
		const res: RoleData  = await this.request.createRole(this.id, o);
		return new Role(this.client, res);
	}
}