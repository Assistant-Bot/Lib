module.exports = (obj, check) => {
    let keys = Object.keys(obj);
    let results = [];

    for (let i = 0; i < keys.length; i++) {
        let index = obj[keys[i]];
        if (check(keys[i], index)) results.push([keys[i], index]);
        else continue;
    }

    return results;
}