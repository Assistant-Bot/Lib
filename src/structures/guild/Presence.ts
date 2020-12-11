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
	public user?: User;
	public guildID?: string
	public status?: 'idle' | 'dnd' | 'online' | 'offline';
	public activities?: Activity[];
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