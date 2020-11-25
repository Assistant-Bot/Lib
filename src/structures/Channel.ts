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
import type Client from "../Client.ts";
import type { ChannelData, ChannelTypes, ChannelTypesNumeric } from "../net/common/Types.ts";
import Base from './Base.ts';

export default class Channel extends Base {
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