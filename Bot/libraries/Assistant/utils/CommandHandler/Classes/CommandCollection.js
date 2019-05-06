let CommandCollection = Map;
CommandCollection.prototype.forEachKey = (func) => {
    if (!typeof func === 'function') throw 'Must be a function';
    let map = this;
    return map.forEach((val, key, arr) => {
        func(key);
    });
}
CommandCollection.prototype.forEachValue = (func) => {
    if (!typeof func === 'function') throw 'Must be a function';
    let map = this;
    return map.forEach((val, key, arr) => {
        func(value);
    });
}
CommandCollection.prototype.toArray = () => {
    let fin = [];
    let map = this;
    map.forEach((val, key, arr) => {
        fin.push([key, val]);
    });
    return fin;
}
CommandCollection.prototype.toObject = () => {
    let fin = {};
    let map = this;
    map.forEach((val, key, arr) => {
        fin[key] = val;
    });
    return fin;
}

module.exports = CommandCollection;