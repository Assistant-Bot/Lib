/***
 *                    _     _              _
 *      /\           (_)   | |            | |
 *     /  \   ___ ___ _ ___| |_ __ _ _ __ | |_
 *    / /\ \ / __/ __| / __| __/ _` | '_ \| __|
 *   / ____ \\__ \__ \ \__ \ || (_| | | | | |_
 *  /_/    \_\___/___/_|___/\__\__,_|_| |_|\__|
 *
 * Copyright (C) 2020 Bavfalcon9
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 3
 * of the License, or (at your option) any later version.
 */
import type Module from '../module/Module.ts';
import type { CommandArgOptions } from './Command.ts';
import type Command from './Command.ts';
import type Permission from './permission/Permission.ts';
import Message from '../structures/Message.ts';
import PermissionManager, { PermissionResolvable, PermissionTestResolvable } from './permission/PermissionManager.ts';
import Client from "../Client.ts";

export type PrefixResolveFunction = (msg: Message) => Promise<string>;

export interface CommandHandlerOptions {
    prefix: PrefixResolveFunction|string;
    processor?: (msg: Message) => Promise<void>;
    allowBots?: boolean;
    allowMention?: boolean;
    additionalArgs?: any;
    debug?: boolean;
}

/**
 * @todo Add module support.
 */
export default class CommandHandler {
    public prefix: PrefixResolveFunction | string;
    public client: Client;
    public options: CommandHandlerOptions;
	#floatingCommands: Command[];
    #modules: Module[];

    public constructor(client: Client, options: CommandHandlerOptions) {
        const defaults: CommandHandlerOptions = CommandHandler.getDefaults();
        this.#modules = [];
		this.#floatingCommands = [];

        for (let option of Object.keys(defaults)) {
            if (!(options as any)[option]) {
                (options as any)[option] = (defaults as any)[option];
            }
        }

        this.client = client;
        this.prefix = options.prefix;
        this.options = options;
        this.processMessage = this.processMessage.bind(this); // little hack to let us to access the command class
    }

    /**
     * Start the command handler
	 * Registers handlers and modules.
     * @todo Make this handle custom interfaces.
     */
    public async start() {
        this.client.on('messageCreate', this.processMessage);
        for (const mod of this.modules) {
            for (const event of mod.events) {
                this.client.on(event[0] as any, event[1]);
            }
        }
    }

    public async processMessage(msg: Message): Promise<void> {
		if (!msg.content) return;
        // create the message
        let prefix: string = (this.prefix instanceof Function)
            ? await this.prefix(msg)
            : this.prefix;
        msg.prefix = prefix;

        // Check to see if theres a mention
        if (this.options.allowMention) {
            const reg: RegExp = new RegExp(`^(?:<(@|@!)${this.client.user.id}(>|> ))`);
            if (reg.test(msg.content)) {
                prefix = (msg.content.match(reg) as RegExpMatchArray)[0];
            }
        }

        let args: string[] = msg.content.slice(prefix.length).trim().split(/ +/g);
        let commandString: string|undefined = args.shift()?.toLowerCase();

        if (!commandString) return;
        if (msg.content.indexOf(prefix) !== 0) return;
        if (this.options.allowBots === false && msg.author.bot) return;

        const command: Command|undefined = this.commands.find(c => c.label === commandString || c.aliases.includes(commandString as string));

        if (!command) return; // not found :(

        // handle argument api v3
        if (command.argumentApi === 3) {
            const argOpts: CommandArgOptions = command.commandOpts.argOptions;
            if (argOpts.matches) {
                if (!argOpts.matches.test(args.join(' '))) {
                    this.capsulateError(command, new Error("Argument did not match argument resolver"), this.client, msg);
                    return;
                }
            }
            if (argOpts.resolve) {
                args = [ ...args.join(' ').split(argOpts.resolve) ];
            } else if (argOpts.wrap) {
                args = [ ...args.join(' ').split(/\"[a-zA-Z0-9]+\"/g)];
            }
        }

        // todo: Explore using a better permission executioner. (I'll do this cadet)
        let results = [
            PermissionManager.testExecution(msg, command.permissions || []),
            PermissionManager.testExecution(msg, command.argPermissions.map(p => p[1]) || [])
        ];



        let failed = results.filter(test => test !== null);

        if (failed.length > 0) {
            try {
                const perm: Permission = PermissionManager.resolvePermission(failed[0]);
                await command.onMissingPermission(this.client, msg, perm, this.options.additionalArgs || {});
                return;
            } catch (e) {
                return this.capsulateError(command, e, this.client, msg);
            }
        }

        try {
            await command.onRun(this.client, msg, args, this.options.additionalArgs || []);
            return;
        } catch (e) {
            return this.capsulateError(command, e, this.client, msg);
        }
    }

    private async capsulateError(command: Command, error: Error, client: Client, msg: Message) {
        try {
            await command.onError(error, client, msg);
        } catch {
            // unregister command due to error.

        }
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

    public registerModule(mod: Module): boolean {
        if (!!this.#modules.filter(m => m.name === mod.name)[0]) return false;
        this.#modules.push(mod);
        return true;
    }

	public registerCommand(command: Command): boolean {
		if (!this.commands.filter(c => c.label === command.label)) {
			this.#floatingCommands.push(command);
			return true;
		}
		return false;
	}

    public unregisterCommand(command: Command): boolean {
        for (let mod of this.#modules) {
            if (mod.hasCommand(command)) {
                mod.unregisterCommand(command);
                return true;
            }
        }

		if (this.#floatingCommands.find(c => c.label === command.label)) {
			this.#floatingCommands = this.#floatingCommands.filter(c => c.label !== command.label);
			return true;
		}

        return false;
    }

    public get commands(): Command[] {
        // if this has proven to defect performance,
        // I will change it
        let commands: Command[] = [...this.#floatingCommands];

        for (let mod of this.#modules) {
            commands.push(...mod.commands);
        }

        return commands;
    }

    public get modules(): Module[] {
        return this.#modules;
    }
}
