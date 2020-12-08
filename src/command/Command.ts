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
import type Message from '../structures/Message';
import type Permission from './permission/Permission';
import type { PermissionResolvable } from './permission/PermissionManager';

export type CommandEvents =
    | 'execute'
    | 'error'
    | 'cooldown'
    | 'permission'
    | 'nopermission';

export interface CommandArgOptions {
    api: 1 | 2 | 3;
    // Whether or not to match args wrapped in qoutations as a single argument "anything between qoutations"
    wrap: boolean; // api 2 and 3 only
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
    permissions?: [number, PermissionResolvable][]; // api 3 only
}

export interface CommandOptions {
    cooldown: number;
    disabledEvents: CommandEvents[];
    argOptions: CommandArgOptions;
}

abstract class Command {
    public name: string;
    public label: string;
    public description: string;
    public commandOpts: CommandOptions;
    public aliases: string[];
    public usage: string[];
    public permissions: Array<string | number | Permission>;
    public module: string;

    public constructor(name: string, label: string, description: string, options: CommandOptions) {
        this.name = name;
        this.label = label;
        this.description = description;
        this.commandOpts = options;
        this.aliases = [];
        this.usage = [];
        this.permissions = [];
        this.module = 'Generic Module';
    }

    /**
     * Called when the command is executed.
     */
    public abstract onRun(client: Client, msg: Eris.Message, args: string[], additional?: any): Promise<void>;

    /**
     * Called when execution fails
     *
     * If this errors, it is supressed, and the command is disabled.
     */
    public async onError(error: Error, client: Client, msg: Eris.Message, additional?: any): Promise<void> { }

    /**
     * Called when a user is on cooldown.
     */
    public async onCooldown(client: Client, msg: Eris.Message, timeLeft: number, additional?: any): Promise<void> { }

    /**
     * Called if the user is missing permission.
     */
    public async onMissingPermission(client: Client, msg: Eris.Message, permission: Permission, additional?: any): Promise<void> {
    }

    /**
     * Gets the argument api version.
     */
    public get argumentApi(): number {
        return this.commandOpts.argOptions.api;
    }

    /**
     * Gets an array of argument permissions.
     */
    public get argPermissions(): [number, PermissionResolvable][] {
        return this.commandOpts.argOptions.permissions || [];
    }
}
export default Command;
