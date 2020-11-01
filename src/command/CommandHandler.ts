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
import type { MemberProps, MessageProps } from '../structures/Properties';
import type { CommandArgOptions } from './Command';
import type Command from './Command';
import type Permission from './permission/Permission';
import Message from '../structures/Message';
import PermissionManager, { PermissionResolvable, PermissionTestResolvable } from './permission/PermissionManager';

export type PrefixResolveFunction = (msg: Message<MessageProps>) => Promise<string>;

export interface CommandHandlerOptions {
    prefix: PrefixResolveFunction|string;
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
    public prefix: PrefixResolveFunction | string;
    public client: Eris.Client;
    public options: CommandHandlerOptions;
    #modules: Module[];

    public constructor(client: Eris.Client, options: CommandHandlerOptions) {
        const defaults: CommandHandlerOptions = CommandHandler.getDefaults();
        this.#modules = [];
        
        for (let option of Object.keys(defaults)) {
            if (!(options as any)[option]) {
                (options as any)[option] = (defaults as any)[option];
            }
        }
        
        this.client = client;
        this.prefix = options.prefix;
        this.options = options;
        this.processMessage = this.processMessage.bind(this); // little hack to let us to access the command class
        this.client.on('messageCreate', this.processMessage);
    }

    /**
     * Start the command handler
     * 
     * @deprecated
     * @todo Make this handle custom interfaces.
     */
    public async start() {
        // doesnt do anything
    }

    public async processMessage(libMessage: MessageProps): Promise<void> {
        // create the message
        const msg: Message<MessageProps> = new Message<MessageProps>(libMessage);
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
        
        const command: Command|undefined = this.commands.filter(c => c.label === commandString)[0];
        
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

        // test permissions
        // The solution with including the indexes
        // at it's current state is very stupid
        // I will definitely make this feature better
        let results = [
            PermissionManager.testExecution(msg, command.permissions || []), // This should ONLY be a `PermissionResolvable`
            PermissionManager.testArgumentExecution(msg, command.argPermissionsIdx || []) // This should be [idx, PermissionResolvable]
        ];



        let failed = results.filter(test => test !== null);




        if (failed.length > 0) {
            try {
                let res: PermissionResolvable;
                if(failed[0] instanceof Array) {
                    if(!args[failed[0][0]]) { // Check if the failed argument even exists
                        return;
                    }
                    res = failed[0][1]
                    console.log(res)
                } else {
                    // @ts-ignore
                    res = failed[0]
                    console.log(res)
                }
                const perm: Permission = PermissionManager.resolvePermission(res); // has to be a permission
                command.onMissingPermission(this.client, msg, perm, ...this.options.additionalArgs || []);
                return;
            } catch (e) {
                return this.capsulateError(command, e, this.client, msg);
            }
        }

        // assuming everything is ok
        // however we should add cooldown before permission checks.

        // Run the command
        try {
            command.onRun(this.client, msg, args, ...this.options.additionalArgs || []);
            return;
        } catch (e) {
            return this.capsulateError(command, e, this.client, msg);
        }
    }

    private capsulateError(command: Command, error: Error, client: Eris.Client, msg: Message<MessageProps>) {
        try {
            command.onError(error, client, msg);
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

    public unregisterCommand(command: Command): boolean {
        for (let mod of this.#modules) {
            if (mod.hasCommand(command)) {
                mod.unregisterCommand(command);
                return true;
            }
        }
        return false;
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
