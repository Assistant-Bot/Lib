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
import type { Client, Message } from 'eris';
import Embed from '../util/Embed';
import type Permission from './permission/Permission';

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
    matches?: RegExp; // api 3 only
    resolve?: RegExp; // api 3 only
    permissions?: Array<string | number | Permission>[]; // api 3 only
}

export interface CommandOptions {
    cooldown: number;
    disabledEvents: CommandEvents[];
    argOptions: CommandArgOptions;
}

abstract class Command {
    public name!: string;
    public label!: string;
    public description!: string;
    public commandOpts!: CommandOptions;
    public aliases?: string[];
    public usage?: string[];
    public permissions?: Array<string | number | Permission>;
    public module?: string;

    /**
     * Called when the command is executed.
     */
    public abstract async onRun(client: Client, msg: Message, args: string[], ...additional: unknown[]): Promise<void>;

    /**
     * Called when execution fails
     * 
     * If this errors, it is supressed, and the command is disabled.
     */
    public async onError(error: Error, client: Client, msg: Message, ...additional: unknown[]): Promise<void> { }

    /**
     * Called when a user is on cooldown.
     */
    public async onCooldown(client: Client, msg: Message, timeLeft: number, ...additional: unknown[]): Promise<void> { }

    /**
     * Called if the user is missing permission.
     */
    public async onMissingPermission(client: Client, msg: Message, permission: Permission, ...additional: unknown[]): Promise<void> { }

    /**
     * Gets the argument api version.
     */
    public get argumentApi(): number {
        return this.commandOpts.argOptions.api;
    }
}
export default Command;

// default regex
/\"[a-zA-Z]+\"/g;
