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
import type Command from '../Command.ts';
import type Permission from '../permission/Permission.ts';

export type GenericFunction = (...args: any[]) => any;
export type Event = [string, GenericFunction];

export default class Module {
	public name: string;
	public commands: Command[];
	public permissions: Permission[];
	public enabled: boolean;
	// to-do Refactor
	public events: Event[];

	public constructor(name: string, commands: Command[], permissions: Permission[] = [], enabled: boolean = true) {
		this.name = name;
		this.commands = commands;
		this.permissions = permissions;
		this.enabled = enabled;
		this.events = [];
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