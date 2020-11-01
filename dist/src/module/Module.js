"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Module {
    constructor(name, commands, permissions = [], enabled = true) {
        this.name = name;
        this.commands = commands;
        this.permissions = permissions;
        this.enabled = enabled;
    }
    registerCommand(command) {
        if (this.commands.filter(c => c.label === command.label)[0])
            return false;
        // forcefully set the module
        command.module = this.name;
        this.commands.push(command);
        return true;
    }
    unregisterCommand(command) {
        for (let i = 0; i < this.commands.length; i++) {
            const cmd = this.commands[i];
            if (cmd.label == command.label) {
                this.commands.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    hasCommand(command) {
        return !!this.commands.filter(c => c.label === command.label)[0];
    }
}
exports.default = Module;
