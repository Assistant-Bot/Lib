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
import type Command from '../command/Command';
import type Permission from '../command/permission/Permission';
declare class Module {
    name: string;
    commands: Command[];
    permissions: Permission[];
    enabled: boolean;
    constructor(name: string, commands: Command[], permissions?: Permission[], enabled?: boolean);
    registerCommand(command: Command): boolean;
    unregisterCommand(command: Command): boolean;
    hasCommand(command: Command): boolean;
}
export default Module;
