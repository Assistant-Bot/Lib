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
import type { Client } from 'eris';
import type Permission from './permission/Permission';
import type { PermissionResolvable } from './permission/PermissionManager';
export declare type CommandEvents = 'execute' | 'error' | 'cooldown' | 'permission' | 'nopermission';
export interface CommandArgOptions {
    api: 1 | 2 | 3;
    wrap: boolean;
    /**
     * @var matches
     * @description [API 3] A test to check for arguments, if this is true, the command is allowed.
     */
    matches?: RegExp;
    /**
     * @var resolve
     * @description [API 3] Resolve arguments based on custom regex.
     */
    resolve?: RegExp;
    permissions?: [number, PermissionResolvable][];
}
export interface CommandOptions {
    cooldown: number;
    disabledEvents: CommandEvents[];
    argOptions: CommandArgOptions;
}
declare abstract class Command {
    name: string;
    label: string;
    description: string;
    commandOpts: CommandOptions;
    aliases: string[];
    usage: string[];
    permissions: Array<string | number | Permission>;
    module: string;
    constructor(name: string, label: string, description: string, options: CommandOptions);
    /**
     * Called when the command is executed.
     */
    abstract onRun(client: Client, msg: Eris.Message, args: string[], additional?: any): Promise<void>;
    /**
     * Called when execution fails
     *
     * If this errors, it is supressed, and the command is disabled.
     */
    onError(error: Error, client: Client, msg: Eris.Message, additional?: any): Promise<void>;
    /**
     * Called when a user is on cooldown.
     */
    onCooldown(client: Client, msg: Eris.Message, timeLeft: number, additional?: any): Promise<void>;
    /**
     * Called if the user is missing permission.
     */
    onMissingPermission(client: Client, msg: Eris.Message, permission: Permission, additional?: any): Promise<void>;
    /**
     * Gets the argument api version.
     */
    get argumentApi(): number;
    /**
     * Gets an array of argument permissions.
     */
    get argPermissions(): [number, PermissionResolvable][];
}
export default Command;
