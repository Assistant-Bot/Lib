"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(name, label, description, options) {
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
     * Called when execution fails
     *
     * If this errors, it is supressed, and the command is disabled.
     */
    async onError(error, client, msg, additional) { }
    /**
     * Called when a user is on cooldown.
     */
    async onCooldown(client, msg, timeLeft, additional) { }
    /**
     * Called if the user is missing permission.
     */
    async onMissingPermission(client, msg, permission, additional) {
    }
    /**
     * Gets the argument api version.
     */
    get argumentApi() {
        return this.commandOpts.argOptions.api;
    }
    /**
     * Gets an array of argument permissions.
     */
    get argPermissions() {
        return this.commandOpts.argOptions.permissions || [];
    }
}
exports.default = Command;
