module.exports = (str) => {
    let splitAt = 1020;
    if (str.length > splitAt) {
        var result = [];
        for (var i = 0; i < str.length; i += splitAt)
            result.push(string.substring(i, i + splitAt));
        return result[0];
    } else return str;
}