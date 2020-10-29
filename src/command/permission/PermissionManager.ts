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
import Eris from "eris";
import Permission from "./Permission";

export type PermissionResolvable = Permission | number | string;

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

    public static testExecution(msg: Eris.Message, permissions: PermissionResolvable[]): Permission|null {
        for (let permission of permissions) {
            if (permission instanceof Permission) {
                if (!permission.resolve(msg, msg.member)) {
                    return permission;
                }
            } else if (typeof permission === 'number') {
                const perm: Permission|undefined = PermissionManager.getById(permission);
                if (!perm) {
                    return perm;
                } else {
                    if (!perm.resolve(msg, msg.member)) {
                        return perm;
                    }
                }
            } else {
                const perm: Permission|undefined = PermissionManager.getByName(permission);
                if (!perm) {
                    return perm;
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
}

// little hack to allow "this" in static method
PermissionManager.bind(PermissionManager);

export default PermissionManager;