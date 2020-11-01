"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Permission_1 = require("./Permission");
class PermissionManager {
    /**
     * Registers a permission to the permission manager
     * @param permission - Permission to register
     */
    static register(permission) {
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
    static unregister(permission) {
        if (this._permissions.filter(p => p.name === permission.name).length < 0) {
            throw new Error('No permission with the name of: "' + permission.name + '" is registered');
        }
        if (this._permissions.filter(p => p.id === permission.id).length < 0) {
            throw new Error('No permission with the id of: "' + permission.id + '" is registered');
        }
        return false;
    }
    static registerAll(...permissions) {
        const response = [];
        for (let perm of permissions) {
            response.push(this.register(perm));
        }
        return response;
    }
    /**
     * Tests whether a permission can use a permission or not.
     */
    static testExecution(msg, permissions) {
        if (!msg.member)
            return -1;
        for (let permission of permissions) {
            if (permission instanceof Permission_1.default) {
                if (!permission.resolve(msg, msg.member)) {
                    return permission;
                }
            }
            else if (typeof permission === 'number') {
                const perm = PermissionManager.getById(permission);
                if (!perm) {
                    return permission;
                }
                else {
                    if (!perm.resolve(msg, msg.member)) {
                        return perm;
                    }
                }
            }
            else {
                const perm = PermissionManager.getByName(permission);
                if (!perm) {
                    return permission;
                }
                else {
                    if (!perm.resolve(msg, msg.member)) {
                        return perm;
                    }
                }
            }
        }
        return null;
    }
    static get permissions() {
        return this._permissions;
    }
    static getByName(name) {
        return this._permissions.filter(p => p.name === name)[0];
    }
    static getById(id) {
        return this._permissions.filter(p => p.id === id)[0];
    }
    static resolvePermission(perm) {
        if (perm instanceof Permission_1.default)
            return perm;
        let permission;
        if (perm === null)
            throw new Error('Can not resolve permission on null');
        if (typeof perm === 'number') {
            permission = this.getById(perm);
        }
        else if (typeof perm === 'string') {
            permission = this.getByName(perm);
        }
        if (!permission)
            throw new Error('Can not resolve permission on undefined.');
        return permission;
    }
}
PermissionManager._permissions = [];
// little hack to allow "this" in static method
PermissionManager.bind(PermissionManager);
exports.default = PermissionManager;
