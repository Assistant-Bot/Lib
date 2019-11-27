module.exports = (string, cutAt, addDots=true) => {
    if (addDots) cutAt = cutAt-3;
    else addDots = (addDots) ? '...' : '';
    if (string.length < cutAt) addDots = '';
    if (typeof addDots === 'boolean') addDots = '';
    return string.split('').slice(0, cutAt).join('') + addDots;
}