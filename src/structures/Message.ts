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
import type * as Eris from 'eris';
import type { MessageReference, Embed as ErisEmbed } from 'eris';
import Embed from '../util/Embed';
import type { DJSMsgType, EmbedProps, MemberProps, MessageProps, UserProps } from './Properties';

class Message<LibMessage extends MessageProps> {
    public readonly activity?: any;
    public readonly application?: any;
    public readonly attachments: any;
    public readonly author: UserProps;
    public readonly content: string;
    public readonly embeds: EmbedProps[];
    public readonly channel: any;
    public readonly member: MemberProps | Eris.Member | null;
    public readonly mentions: UserProps[];
    public readonly pinned: boolean;
    public readonly reactions: { 
        [s: string]: unknown;
        count: number;
        me: boolean;
    };
    public readonly timestamp?: number;
    public readonly tts: boolean;
    public readonly type: Number;
    public readonly messageReference?: MessageReference;
    public readonly reference?: MessageReference;
    public readonly webhookID?: string;
    #prefix: string;

    public constructor(m: LibMessage) {
        this.#prefix = '';
        this.type = m.type as number; // do this properly
        this.activity = m.activity;
        this.application = m.application;
        this.attachments = m.attachments;
        this.author = m.author;
        this.content = m.content;
        this.embeds = m.embeds as EmbedProps[];
        this.channel = m.channel;
        this.member = m.member;
        this.mentions = m.mentions;
        this.pinned = m.pinned;
        this.reactions = m.reactions;
        this.timestamp = m.timestamp || m.createdTimestamp;
        this.tts = m.tts;
        this.reference = (m.reference || m.messageReference) as any;
        this.webhookID = m.webhookID;
    }

    public set prefix(prefix: string) {
        this.#prefix = prefix;
    }

    public get prefix(): string {
        return this.#prefix;
    }
}

export default Message;