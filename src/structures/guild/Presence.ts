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
import User from "../User.ts";
interface Activity {
	name: string;
	type: 0 | 1 | 2 | 4 | 5;
	url?: string;
	created_at: number;
	timestamps: {
		start: number;
		end: number
	},
	application_id: number;
	details?: string;
	state?: string
	emoji?: {
		id: string;
		name: string;
		animated: string;
	};
	party: {
		id: string
		size: [number, number]
	},
	assets: {
		large_image: string;
		large_text: string;
		small_image: string;
		small_text: string
	},
	secrets: {
		join?: string;
		spectate?: string;
		match?: string
	},
	instance?: boolean
	flags?: number
}

export default class Presence {
	/** User of the presence */
	public user?: User;
	/** Guild ID of the presence */
	public guildID?: string
	/** Status of the presence */
	public status?: 'idle' | 'dnd' | 'online' | 'offline';
	/** Activities of the presence */
	public activities?: Activity[];
	/** Client status of the presence */
	public clientStatus?: Partial<{desktop: string, mobile: string, web: string}>;

	public constructor(data: any) { // I'd PresenceData later :((
		this.update(data);
	}

	public update(data: any) {
		this.user = data.user;
		this.guildID = data.guild_id;
		this.status = data.status;
		this.activities = data.activities;
		this.clientStatus = data.client_status;
	}
}