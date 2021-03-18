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
import Client from "../../Client.ts";
import { ApplicationCommandData, ApplicationCommandOption, ApplicationData } from "../../net/common/Types.ts";
import Endpoints from "../../net/rest/Endpoints.ts";
import EventAdapter from "../../util/client/EventAdapter.ts";
import Base from "../Base.ts";
import Application from "../oauth/Application.ts";
import Interaction from "./Interaction.ts";

export type CommandOptionType =
	| "SubCommand"
	| "SubCommandGroup"
	| "String"
	| "Integer"
	| "Boolean"
	| "User"
	| "Channel"
	| "Role"

export default class AppCommand extends Base {
	public name!: string;
	public description!: string;
	public options!: ApplicationCommandOption[];
	public application!: string;

	public constructor(client: Client<EventAdapter>, data: ApplicationCommandData) {
		super(client, data.id!);
		this.update(data);
	}

	public async update(data: ApplicationCommandData) {
		this.name = data.name;
		this.description = data.name;
		this.options = data.options || [];
		this.application = data.application_id!;
	}

	public parse(): ApplicationCommandData {
		return {
			name: this.name,
			description: this.description,
			options: this.options
		}
	}

	public addSubCommand(data: ApplicationCommandOption): void {
		this.options.push(data);
	}

	public getType(data: ApplicationCommandOption): CommandOptionType {
		switch (data.type) {
			default:
			case 1:
				return "SubCommand";
			case 2:
				return "SubCommandGroup";
			case 3:
				return "String";
			case 4:
				return "Integer";
			case 5:
				return "Boolean";
			case 6:
				return "User";
			case 7:
				return "Channel";
			case 8:
				return "Role";
		}
	}

	/**
	 * When created, you can listen to this on: .on(command)
	 * @param client
	 * @param data
	 */
	public static async create(client: Client<EventAdapter>, data: ApplicationCommandData & { guildId?: string }): Promise<AppCommand> {
		let res: ApplicationCommandData | false
		if (data.guildId) {
			res = await client.discordHandler.createAppCommand(data.application_id!, data.guildId, data);
			delete data.guildId;
		} else {
			res = await client.discordHandler.createAppGlobalCommand(data.application_id!, data);
		}

		if (res) {
			return new this(client, res);
		} else {
			return new this(client, data);
		}
	}
}