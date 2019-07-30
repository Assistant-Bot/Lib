module.exports = (obj, ref, key) => {
    let final = [];

    for (let i = 0; i < ref.length; ref++) {
        let value = obj[ref];

        if (!value) continue;
        if (!value[key]) continue;
        final.push(value[key]);
    }

    return final;
}