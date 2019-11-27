const { promisify } = require('util');
const fs = require('fs');
const read = promisify(fs.readFile);


module.exports = async (file) => {
    return read(file, 'utf8');
}