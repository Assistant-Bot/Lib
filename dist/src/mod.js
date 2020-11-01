"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Embed = exports.Message = exports.Module = exports.PermissionManager = exports.Permission = exports.CommandHandler = exports.Command = void 0;
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
var Command_1 = require("./command/Command");
Object.defineProperty(exports, "Command", { enumerable: true, get: function () { return Command_1.default; } });
var CommandHandler_1 = require("./command/CommandHandler");
Object.defineProperty(exports, "CommandHandler", { enumerable: true, get: function () { return CommandHandler_1.default; } });
var Permission_1 = require("./command/permission/Permission");
Object.defineProperty(exports, "Permission", { enumerable: true, get: function () { return Permission_1.default; } });
var PermissionManager_1 = require("./command/permission/PermissionManager");
Object.defineProperty(exports, "PermissionManager", { enumerable: true, get: function () { return PermissionManager_1.default; } });
var Module_1 = require("./module/Module");
Object.defineProperty(exports, "Module", { enumerable: true, get: function () { return Module_1.default; } });
var Message_1 = require("./structures/Message");
Object.defineProperty(exports, "Message", { enumerable: true, get: function () { return Message_1.default; } });
var Embed_1 = require("./util/Embed");
Object.defineProperty(exports, "Embed", { enumerable: true, get: function () { return Embed_1.default; } });
