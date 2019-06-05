class CommandCollection extends Map {
    constructor() {
       super();
    }

    /**
     * @param {Function} func - Call back
     */

    forEachKey(func) {
        if (!func) throw 'You need a callback';
        if (!typeof func === 'function') throw 'Must be a function';
        let map = this;
        return map.forEach((val, key, arr) => {
            func(key);
        });
    }

    forEachValue(func) {
        if (!func) throw 'You need a callback';
        if (!typeof func === 'function') throw 'Must be a function';
        let map = this;
        return map.forEach((val, key, arr) => {
            func(value);
        });
    }

    find(func) {
        if (!func) throw 'You need a callback';
        if (!typeof func === 'function') throw 'Must be a function';
        
        let results = [];
        let poss = this.toArray();
        
        for (let i = 0; i < poss.length; i++) {
            let key = poss[i][0];
            let entry = poss[i][1];
            if (func(key, entry) == true) results.push(poss[i]);
            else continue;
        }

        return results;

    }

    toArray() {
        let fin = [];
        let map = this;
        map.forEach((val, key, arr) => {
            fin.push([key, val]);
        });
        return fin;
    }

    toObject() {
        let fin = {};
        let map = this;
        map.forEach((val, key, arr) => {
            fin[key] = val;
        });
        return fin;
    }
    
}

module.exports = CommandCollection;