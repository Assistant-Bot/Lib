module.exports = (string, cutAt, addDots=true) => {
    if (addDots) cutAt = cutAt-3;
    addDots = (addDots) ? '...' : '';
    return string.split('').slice(0, cutAt).join('') + addDots;
}