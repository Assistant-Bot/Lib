"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _modules;
Object.defineProperty(exports, "__esModule", { value: true });
require("../structures/Message");
const PermissionManager_1 = require("./permission/PermissionManager");
/**
 * @todo Add module support.
 */
class CommandHandler {
    constructor(client, options) {
        _modules.set(this, void 0);
        const defaults = CommandHandler.getDefaults();
        __classPrivateFieldSet(this, _modules, []);
        for (let option of Object.keys(defaults)) {
            if (!options[option]) {
                options[option] = defaults[option];
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
    async start() {
        // doesnt do anything
    }
    async processMessage(msg) {
        // create the message
        let prefix = (this.prefix instanceof Function)
            ? await this.prefix(msg)
            : this.prefix;
        msg.prefix = prefix;
        // Check to see if theres a mention
        if (this.options.allowMention) {
            const reg = new RegExp(`^(?:<(@|@!)${this.client.user.id}(>|> ))`);
            if (reg.test(msg.content)) {
                prefix = msg.content.match(reg)[0];
            }
        }
        let args = msg.content.slice(prefix.length).trim().split(/ +/g);
        let commandString = args.shift()?.toLowerCase();
        if (!commandString)
            return;
        if (msg.content.indexOf(prefix) !== 0)
            return;
        if (this.options.allowBots === false && msg.author.bot)
            return;
        const command = this.commands.filter(c => c.label === commandString)[0];
        if (!command)
            return; // not found :(
        // handle argument api v3
        if (command.argumentApi === 3) {
            const argOpts = command.commandOpts.argOptions;
            if (argOpts.matches) {
                if (!argOpts.matches.test(args.join(' '))) {
                    this.capsulateError(command, new Error("Argument did not match argument resolver"), this.client, msg);
                    return;
                }
            }
            if (argOpts.resolve) {
                args = [...args.join(' ').split(argOpts.resolve)];
            }
            else if (argOpts.wrap) {
                args = [...args.join(' ').split(/\"[a-zA-Z0-9]+\"/g)];
            }
        }
        // todo: Explore using a better permission executioner. (I'll do this cadet)
        let results = [
            PermissionManager_1.default.testExecution(msg, command.permissions || []),
            PermissionManager_1.default.testExecution(msg, command.argPermissions.map(p => p[1]) || [])
        ];
        let failed = results.filter(test => test !== null);
        if (failed.length > 0) {
            try {
                const perm = PermissionManager_1.default.resolvePermission(failed[0]);
                command.onMissingPermission(this.client, msg, perm, this.options.additionalArgs || {});
                return;
            }
            catch (e) {
                return this.capsulateError(command, e, this.client, msg);
            }
        }
        try {
            command.onRun(this.client, msg, args, this.options.additionalArgs || []);
            return;
        }
        catch (e) {
            return this.capsulateError(command, e, this.client, msg);
        }
    }
    capsulateError(command, error, client, msg) {
        try {
            command.onError(error, client, msg);
        }
        catch {
            // unregister command due to error.
        }
    }
    static getDefaults() {
        return {
            prefix: 'a!',
            allowBots: false,
            allowMention: true,
            additionalArgs: [],
            debug: false
        };
    }
    registerModule(mod) {
        if (!!__classPrivateFieldGet(this, _modules).filter(m => m.name === mod.name)[0])
            return false;
        __classPrivateFieldGet(this, _modules).push(mod);
        return true;
    }
    unregisterCommand(command) {
        for (let mod of __classPrivateFieldGet(this, _modules)) {
            if (mod.hasCommand(command)) {
                mod.unregisterCommand(command);
                return true;
            }
        }
        return false;
    }
    get commands() {
        // if this has proven to defect performance,
        // I will change it
        let commands = [];
        for (let mod of __classPrivateFieldGet(this, _modules)) {
            commands.push(...mod.commands);
        }
        return commands;
    }
    get modules() {
        return __classPrivateFieldGet(this, _modules);
    }
}
exports.default = CommandHandler;
_modules = new WeakMap();
