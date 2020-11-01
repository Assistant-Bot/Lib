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
import type { MessageReference } from 'eris';
import type { EmbedProps, MemberProps, MessageProps, UserProps } from './Properties';
declare class Message<LibMessage extends MessageProps> {
    #private;
    readonly activity?: any;
    readonly application?: any;
    readonly attachments: any;
    readonly author: UserProps;
    readonly content: string;
    readonly embeds: EmbedProps[];
    readonly channel: any;
    readonly member: MemberProps | Eris.Member | null;
    readonly mentions: UserProps[];
    readonly pinned: boolean;
    readonly reactions: {
        [s: string]: unknown;
        count: number;
        me: boolean;
    };
    readonly timestamp?: number;
    readonly tts: boolean;
    readonly type: Number;
    readonly messageReference?: MessageReference;
    readonly reference?: MessageReference;
    readonly webhookID?: string;
    constructor(m: LibMessage);
    set prefix(prefix: string);
    get prefix(): string;
}
export default Message;
