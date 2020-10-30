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

class Module {
    public name: string;
    public commands: Command[];
    public permissions: Permission[];
    public enabled: boolean;

    public constructor(name: string, commands: Command[], permissions: Permission[] = [], enabled: boolean = true) {
        this.name = name;
        this.commands = commands;
        this.permissions = permissions;
        this.enabled = enabled;
    }

    public registerCommand(command: Command): boolean {
        if (this.commands.filter(c => c.label === command.label)[0]) return false;
        // forcefully set the module
        command.module = this.name;
        this.commands.push(command);
        return true;
    }

    public unregisterCommand(command: Command): boolean {
        for (let i = 0; i < this.commands.length; i++) {
            const cmd: Command = this.commands[i];
            
            if (cmd.label == command.label) {
                this.commands.splice(i, 1);
                return true;
            }
        }

        return false;
    }

    public hasCommand(command: Command): boolean {
        return !!this.commands.filter(c => c.label === command.label)[0];
    }
}

export default Module;