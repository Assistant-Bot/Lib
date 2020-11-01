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
import type Module from '../module/Module';
import type { MessageProps } from '../structures/Properties';
import type Command from './Command';
import Message from '../structures/Message';
export declare type PrefixResolveFunction = (msg: Message<MessageProps>) => Promise<string>;
export interface CommandHandlerOptions {
    prefix: PrefixResolveFunction | string;
    processor?: (msg: Message<MessageProps>) => Promise<void>;
    allowBots?: boolean;
    allowMention?: boolean;
    additionalArgs?: any[];
    debug?: boolean;
}
/**
 * @todo Add module support.
 */
export default class CommandHandler {
    #private;
    prefix: PrefixResolveFunction | string;
    client: Eris.Client;
    options: CommandHandlerOptions;
    constructor(client: Eris.Client, options: CommandHandlerOptions);
    /**
     * Start the command handler
     *
     * @deprecated
     * @todo Make this handle custom interfaces.
     */
    start(): Promise<void>;
    processMessage(libMessage: MessageProps): Promise<void>;
    private capsulateError;
    static getDefaults(): CommandHandlerOptions;
    registerModule(mod: Module): boolean;
    unregisterCommand(command: Command): boolean;
    get commands(): Command[];
    get modules(): Module[];
}
