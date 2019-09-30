/**
 * @author John.#9309
 * @description Register permissions for the command handler
 */
const Permission = require('./Classes/Permission');
const AdvancedMap = require('../Classes/AdvancedMap');

class PermissionManager {
    constructor(opts) {
        if (opts) {
            if (!opts.bindValue) throw 'Could not parse';
        } 
        this.permissions = new AdvancedMap();
    }

    register(permission) {
        if (!permission) throw 'Must provide a permission to register.';
        if (!permission instanceof Permission) throw 'Permission must be an instanceof Permission class.';
        else {
            if (this.permissions.has(permission.permission)) throw 'Permission' + permission.permission + 'already exists.';
            this.permissions.add(permission.permission, permission);
        }
    }

    unregister(permission) {
        if (typeof permission == 'string') {
            return this.permissions.delete(permission);
        }

        if (permission instanceof Permission) {
            return this.permissions.unset(permission);
        } else {
            throw 'Invalid permission scope.'
        }
    }
}

module.exports = PermissionManager;