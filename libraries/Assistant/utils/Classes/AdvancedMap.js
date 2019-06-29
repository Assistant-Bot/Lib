class AdvancedMap extends Map {
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
            func(key, val);
        });
    }

    forEachValue(func) {
        if (!func) throw 'You need a callback';
        if (!typeof func === 'function') throw 'Must be a function';
        let map = this;
        return map.forEach((val, key, arr) => {
            func(val, key);
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

    getKeys() {
        return Array.from(this.keys());
    }

    getEnteries() {
        return Array.from(this.entries());
    }

    removeDuplicates(options) {
        if (!options) options = {
            complete: true,
            keys: true,
            entries: false
        }

        let unparsed = this.toArray();
        let completed = [];

        for (let i = 0; i < unparsed.length; i++) {
            let complete = unparsed[i];
            let key = unparsed[i][0];
            let entry = unparsed[i][0];

            if (options.complete && complete.includes(complete)) continue;
            if (options.keys && completed.filter(v => v[0] == key)[0].length >= 0) continue;
            if (options.entries && complete.filter(v => v[1] == entry).length >= 0) continue;
            else completed.push(complete);
        }

        this.fromArray(completed);
        return this;
    }

    fromArray(arr, removeDuplicate) {
        // do check
        if (!arr[0]) throw 'Parsing error';
        if (!arr[1]) throw 'Parsing error';
        if (typeof arr[0] !== 'object') throw 'Parsing error';
        if (typeof arr[1] !== 'object') throw 'Parsing error';

        for (let i = 0; i < arr.length; i++) {
            let entry = arr[i];
            if (!entry[0]) throw 'Parsing error';
            if (!entry[1]) throw 'Parsing error';
            if (this.has(entry[0]) && removeDuplicate == true) continue;
            else this.set(entry[0], entry[1]); 
        }

        return this;
    }

    clone() {
        return this;
    }

    /*
    unset(val) {
        let poss = this.fo
    }*/

}

module.exports = AdvancedMap;