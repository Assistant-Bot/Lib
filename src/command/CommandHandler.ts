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
import Eris from 'eris';
import type Module from '../module/Module';
import Command from './Command';
import Permission from './permission/Permission';
import PermissionManager from './permission/PermissionManager';

export type PrefixResolveFunction = (msg: Eris.Message) => Promise<string>;

export interface CommandHandlerOptions {
    prefix: PrefixResolveFunction|string;
    processor?: (msg: Eris.Message) => Promise<void>;
    allowBots?: boolean;
    allowMention?: boolean;
    additionalArgs?: any[];
    debug?: boolean;
}

export default class CommandHandler {
    public prefix: PrefixResolveFunction | string;
    public client: Eris.Client;
    public options: CommandHandlerOptions;
    #modules: Module[];

    public constructor(client, options: CommandHandlerOptions) {
        const defaults: CommandHandlerOptions = CommandHandler.getDefaults();
        
        for (let option of Object.keys(defaults)) {
            if (!options[option]) {
                options[option] = defaults[option];
            }
        }
        
        this.client = client;
        this.prefix = options.prefix;
        this.options = options;
    }

    public async processMessage(msg: Eris.Message): Promise<void> {
        let prefix: string = (this.prefix instanceof Function) 
            ? await this.prefix(msg)
            : this.prefix;

        // Check to see if theres a mention
        if (this.options.allowMention) {
            const reg: RegExp = new RegExp(`^(?:<(@|@!)${this.client.user.id}(>|> ))`);
            if (reg.test(msg.content)) {
                prefix = msg.content.match(reg)[0];
            }
        }

        let args: string[] = msg.content.slice(0, prefix.length).trim().split(/ +/g);
        let commandString: string = args.shift().toLowerCase();

        if (msg.content.indexOf(prefix) !== 0) return;
        if (this.options.allowBots === false && msg.author.bot) return;
        
        // get the command.
        const command: Command|undefined = this.commands.filter(c => c.label === commandString)[0];

        if (!command) return; // not found :(
        
        // test permissions
    }

    public static getDefaults(): CommandHandlerOptions {
        return {
            prefix: 'a!',
            allowBots: false,
            allowMention: true,
            additionalArgs: [],
            debug: false
        }
    }

    public get commands(): Command[] {
        // if this has proven to defect performance,
        // I will change it
        let commands: Command[] = [];

        for (let mod of this.#modules) {
            commands.push(...mod.commands);
        }

        return commands;
    }

    public get modules(): Module[] {
        return this.#modules;
    }
}