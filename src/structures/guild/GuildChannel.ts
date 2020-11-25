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
import type Client from "../../Client.ts";
import type { ChannelData } from "../../net/common/Types.ts";
import Endpoints from "../../net/rest/Endpoints.ts";
import Channel from "../Channel.ts";
import Message, { MessageContent } from "../Message.ts";

export default class GuildChannel extends Channel {
    public name!: string;
    public guild!: any;
    public position!: number;
    public permissions!: any;

    public constructor(client: Client, data: ChannelData) {
        super(client, data);
        this.update(data);
    }

    public update(data: ChannelData): void {
        this.name = data.name || '';
        this.guild = this.client.dataStore?.guilds.get(data.guild_id) || data.guild_id;
        this.position = data.position || -1;
        this.permissions = data.permission_overwrites;
    }

    public async send(content: MessageContent): Promise<Message> {
        return new Message(this.client, {});
    }

    public async delete(): Promise<boolean> {
        try {
            const res: Response = await this.client.requestHandler.makeAndSend(Endpoints.channel(this.id), "DELETE");
            if (res.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            throw e;
        }
    }
}