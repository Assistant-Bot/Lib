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
export const REST_VERSION: string = 'v8';
export const GATEWAY: string = '/gateway'
export const DOMAIN: string = 'https://discord.com';
export const BASE_URL: string = 'https://discord.com/api/' + REST_VERSION;
export const BASE_API_URL: string = 'https://discord.com/api';
export const GATEWAY_URL: string = 'wss://gateway.discord.gg/?v=8&encoding=json';

export default class Endpoints {
	public static channel(id: string): string {
		return '/channels/' + id;
	}

	public static channel_purge(id: string): string {
		return this.channel(id) + '/messages/bulk-delete';
	}

	public static channel_ring(id: string): string {
		return this.channel(id) + '/call/ring';
	}

	public static channel_crosspost(id: string, messageId: string): string {
		return this.channel(id) + '/messages/' + messageId + '/crosspost';
	}

	public static channel_resolve(id: string, ...additional: string[]): string {
		return this.channel(id) + '/' + additional.join('/');
	}

	public static channel_messages(id: string, msgId?: string): string {
		return this.channel(id) + (!!msgId ? '/messages/' + msgId : '/messages');
	}

	public static channel_permission(id: string, overwriteId: string): string {
		return this.channel(id) + "/permissions/" + overwriteId;
	}

	public static channel_invites(id: string): string {
		return this.channel(id) + '/invites';
	}

	public static channel_pins(id: string): string {
		return this.channel(id) + '/pins';
	}

	public static channel_pin(id: string, msgId: string): string {
		return this.channel_pins(id) + "/" + msgId;
	}

	public static typing_indicator(id: string): string {
		return this.channel(id) + '/typing';
	}

	public static message_reactions(id: string, msgId: string): string {
		return this.channel_messages(id, msgId) + "/reactions/"
	}

	public static message_reaction(id: string, msgId: string, emojiId: string): string {
		return this.message_reactions(id, msgId) + encodeURIComponent(emojiId)
	}

	public static me_reaction(id: string, msgId: string, emojiId: string): string {
		return this.message_reaction(id, msgId, emojiId) + '/@me';
	}

	public static user_reaction(id: string, msgId: string, emojiId: string, userId: string): string {
		return this.message_reaction(id, msgId, emojiId) + "/" + userId;
	}

	public static guild(id: string): string {
		return '/guilds/' + id;
	}

	public static guild_resolve(id: string, ...additional: string[]): string {
		return this.channel(id) + '/' + additional.join('/');
	}

	public static guild_channels(id: string): string {
		return this.guild(id) + "/channels";
	}

	public static guild_roles(id: string): string {
		return this.guild(id) + "/roles";
	}

  	public static guild_role(guildId: string, roleId: string): string {
    	return this.guild_roles(guildId) + "/" + roleId;
  	}

	public static guild_emojis(id: string): string {
		return this.guild(id) + '/emojis';
	}

	public static guild_emoji(id: string, emojiId: string): string {
		return this.guild_emojis(id) + '/' + emojiId;
	}

	public static guild_regions(id: string): string {
		return this.guild(id) + "/regions";
	}

	public static guild_invites(id: string): string {
		return this.guild(id) + "/invites";
	}

	public static guild_integrations(id: string): string {
		return this.guild(id) + "/integrations";
	}

	public static guild_integration(id: string, intId: string): string {
		return this.guild_integrations(id) + "/" + intId;
	}

	public static guild_widget(id: string): string {
		return this.guild(id) + "/widget";
	}

	public static guild_vanity_url(id: string): string {
		return this.guild(id) + "/vanity-url"
	}

	public static guild_audit_logs(id: string): string {
		return this.guild(id) + '/audit-logs';
	}

	public static guild_members(id: string) {
		return this.guild(id) + "/members"
	}

	public static guild_member(guildId: string, id: string) {
		return this.guild_members(guildId) + "/" + id;
	}

	public static guild_bans(id: string) {
		return this.guild(id) + '/bans';
	} 

	public static guild_ban(id: string, userId: string) {
		return this.guild_bans(id) + "/" + userId;
	}

	public static invite(code: string) {
		return "/invites/" + code;
	}

	public static me_user() {
		return "/users/@me";
	}

	public static me_guilds() {
		return this.me_user() + "/guilds";
	}

	public static me_guild(id: string) {
		return this.me_guilds() + "/" + id;
	}

	public static me_channels() {
		return this.me_user() + "/channels";
	}

	public static user(id: string) {
		return "/users/" + id;
	}

	public static rest_gateway(bot: boolean): string {
		return BASE_URL + GATEWAY + ((bot) ? '/bot' : '');
	}

	public static discordApplication(id: string = "@me"): string {
		return '/oauth2/applications/' + id;
	}

	public static applicationCommand(id: string): string {
		return "/applications/" + id + "/commands";
	}

	public static applicationCommandGuild(id: string, guildId: string): string {
		return "/applications/" + id + "/guilds/" + guildId + "/commands";
	}

	public static interactionResponse(id: string, token: string): string {
		return "/interactions/" + id + "/" + token + "/callback";
	}

	public static createWebhook(id: string): string {
		return "/channels/" + id + "/webhooks";
	}

	public static executeWebhook(id: string, token: string) {
		return "/webhooks/" + id + "/" + token;
	}

	public static editWebhook(wID: string, token: string, mID: string) {
		return this.executeWebhook(wID, token) + "/messages/" + mID;
	}

	public static getDMChannel(id: string) {
		return this.user(id) + '/channels';
	}
}