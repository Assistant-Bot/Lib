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
export { default as Command } from './command/Command';
export { 
    default as CommandHandler,
    CommandHandlerOptions,
    PrefixResolveFunction
} from './command/CommandHandler';
export { default as Permission } from './command/permission/Permission';
export {
    default as PermissionManager,
    PermissionTestResolvable,
    PermissionResolvable
} from './command/permission/PermissionManager';
export { default as Module } from './module/Module';
export { default as Message } from './structures/Message';
export {
    FunctionStringResponse,
    DJSMsgType,
    BaseProps,
    UserProps,
    MemberProps,
    MessageProps,
    RoleProps,
    EmbedProps
} from './structures/Properties';
export { default as Embed } from './util/Embed';