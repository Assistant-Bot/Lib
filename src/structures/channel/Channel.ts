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
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 */
import type Client from "../../Client.ts";
import type { ChannelData, ChannelTypes, ChannelTypesNumeric } from "../../net/common/Types.ts";
import Base from '../Base.ts';

abstract class Channel extends Base {
	public typeNumeric!: ChannelTypesNumeric;

	public constructor(client: Client, data: ChannelData) {
		super(client, data.id);
		this.update(data);
	}

	public update(data: ChannelData): void {
		this.typeNumeric = data.type;
	}

	public get type(): ChannelTypes {
		switch (this.typeNumeric) {
			case 0:
				return 'Text';
			case 1:
				return 'DM';
			case 2:
				return 'Voice';
			case 3:
				return 'Group';
			case 4:
				return 'Category';
			case 5:
				return 'News';
			case 6:
				return 'Store';
			default:
				return 'Unknown';
		}
	}
}

export default Channel;