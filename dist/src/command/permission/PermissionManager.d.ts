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
import type Message from '../../structures/Message';
import Permission from "./Permission";
export declare type PermissionResolvable = Permission | number | string;
export declare type PermissionTestResolvable = PermissionResolvable | null;
declare class PermissionManager {
    static _permissions: Permission[];
    /**
     * Registers a permission to the permission manager
     * @param permission - Permission to register
     */
    static register(permission: Permission): boolean;
    /**
     * Registers a permission to the permission manager
     * To implement.
     * @param permission - Permission to register
     */
    static unregister(permission: Permission): boolean;
    static registerAll(...permissions: Permission[]): boolean[];
    /**
     * Tests whether a permission can use a permission or not.
     */
    static testExecution(msg: Message<Eris.Message>, permissions: PermissionResolvable[]): PermissionResolvable | null;
    static get permissions(): Permission[];
    static getByName(name: string): Permission | undefined;
    static getById(id: number): Permission | undefined;
    static resolvePermission(perm: PermissionTestResolvable): Permission;
}
export default PermissionManager;
