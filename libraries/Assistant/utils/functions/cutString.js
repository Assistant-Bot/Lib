module.exports = (string, cutAt, addDots=true) => {
    if (addDots) cutAt = cutAt-3;
    else addDots = (addDots) ? '...' : '';
    if (string.length < cutAt) addDots = '';
    return string.split('').slice(0, cutAt).join('') + addDots;
}