class Permission {
    /**
     * Register Permission
     * @param {String} name - Name of the permission
     * @param {Int} permission - Permission integer or identifier
     * @param {Function} func - Permission check function
     */
    constructor (name, permission=0, func) {
        if (!func) throw 'Paramater 2 expects a function.';
        if (typeof func !== 'function') throw 'Paramater 2 expects a function.';
        if (!this.onTest(func)) throw 'Paramater 2 expects a function that returns Boolean.';

        /* Constants */
        this.permission = permission;
        this.func = func;
        this.name = name;
    }

    /**
     * Test function for identifying whether permission function is valid
     * @param {Function} func - Check function
     */
    onTest(f) {
        /** TO DO */
        return true;
    }

    /**
     * @param {Object} msg - Message
     * @returns {Boolean}
     */
    execute(msg) {
        return this.func(msg);
    }

    /**
     * @returns {String}
     */
    getName() {
        return this.name;
    }

    /**
     * @returns {any}
     */
    getPermission() {
        return this.permission;
    }
}

module.exports = Permission;