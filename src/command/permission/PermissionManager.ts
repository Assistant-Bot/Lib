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
import type Message from "../../structures/Message.ts";
import Permission from "./Permission.ts";

export type PermissionResolvable = Permission | number | string;
export type PermissionTestResolvable = PermissionResolvable | null;

class PermissionManager {
    public static _permissions: Permission[] = [];

    /**
     * Registers a permission to the permission manager
     * @param permission - Permission to register
     */
    public static register(permission: Permission): boolean {
        if (this._permissions.filter(p => p.name === permission.name).length > 0) {
            throw new Error('A permission with the name of: "' + permission.name + '" is already registered');
        }

        if (this._permissions.filter(p => p.id === permission.id).length > 0) {
            throw new Error('A permission with the id of: "' + permission.id + '" is already registered');
        }

        this._permissions.push(permission);

        return true;
    }

    /**
     * Registers a permission to the permission manager
     * To implement.
     * @param permission - Permission to register
     */
    public static unregister(permission: Permission): boolean {
        if (this._permissions.filter(p => p.name === permission.name).length < 0) {
            throw new Error('No permission with the name of: "' + permission.name + '" is registered');
        }

        if (this._permissions.filter(p => p.id === permission.id).length < 0) {
            throw new Error('No permission with the id of: "' + permission.id + '" is registered');
        }

        return false;
    }

    public static registerAll(...permissions: Permission[]): boolean[] {
        const response: boolean[] = [];
        for (let perm of permissions) {
            response.push(this.register(perm));
        }
        return response;
    }

    /**
     * Tests whether a permission can use a permission or not.
     */
    public static testExecution(msg: Message, permissions: PermissionResolvable[]): PermissionResolvable|null {
        if (!msg.member) return -1;
        for (let permission of permissions) {
            if (permission instanceof Permission) {
                if (!permission.resolve(msg, msg.member)) {
                    return permission;
                }
            } else if (typeof permission === 'number') {
                const perm: Permission|undefined = PermissionManager.getById(permission);
                if (!perm) {
                    return permission;
                } else {
                    if (!perm.resolve(msg, msg.member)) {
                        return perm;
                    }
                }
            } else {
                const perm: Permission|undefined = PermissionManager.getByName(permission);
                if (!perm) {
                    return permission;
                } else {
                    if (!perm.resolve(msg, msg.member)) {
                        return perm;
                    }
                }
            }
        }

        return null;
    }

    public static get permissions(): Permission[] {
        return this._permissions;
    }

    public static getByName(name: string): Permission | undefined {
        return this._permissions.filter(p => p.name === name)[0];
    }

    public static getById(id: number): Permission | undefined {
        return this._permissions.filter(p => p.id === id)[0];
    }

    public static resolvePermission(perm: PermissionTestResolvable): Permission {
        if (perm instanceof Permission) return perm;

        let permission: Permission | undefined;

        if (perm === null) throw new Error('Can not resolve permission on null');

        if (typeof perm === 'number') {
            permission = this.getById(perm);
        } else if (typeof perm === 'string') {
            permission = this.getByName(perm);
        }

        if (!permission) throw new Error('Can not resolve permission on undefined.');

        return permission;
    }
}

// little hack to allow "this" in static method
PermissionManager.bind(PermissionManager);

export default PermissionManager;
