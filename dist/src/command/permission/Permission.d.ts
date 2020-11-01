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
import type * as Eris from "eris";
import type Message from "../../structures/Message";
import type { MemberProps, MessageProps } from "../../structures/Properties";
declare abstract class Permission {
    #private;
    name: string;
    match?: RegExp;
    constructor(name: string, id: number, match?: RegExp);
    /**
     * Whether or not the user passes this permission.
     * You should change this
     */
    abstract can(msg: Message<MessageProps>, user: MemberProps | Eris.Member): boolean;
    resolve(msg: Message<MessageProps>, user: MemberProps | Eris.Member): boolean;
    get id(): number;
}
export default Permission;
