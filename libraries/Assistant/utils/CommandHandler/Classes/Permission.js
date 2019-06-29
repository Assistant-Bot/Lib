class Permission {
    constructor (permission=0, func) {
        if (!func) throw 'Paramater 2 expects a function.';
        if (typeof func !== 'function') throw 'Paramater 2 expects a function.';
        if (!this.onTest(func)) throw 'Paramater 2 expects a function that returns Boolean.';

        /* Constants */
        this.permission = permission;
        this.func = func;
        this.name = 'Permission';
    }

    execute(msg) {
        return this.func(msg);
    }

    onTest(f) {
        return true;
    }
}

module.exports = Permission;