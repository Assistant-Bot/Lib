const fs = require('fs');
module.exports = async function (directory, onFiles) {

    if (!directory) throw 'Directory not defined.';
    if (!onFiles) throw 'File handler not defined.';
    if (typeof onFiles !== 'function') throw 'File handler must be a function.';
    if (typeof directory !== 'string') throw 'Directory must be a string.';
    if (!resolvable(directory)) throw 'Directory provided could not be resolved.';

    run(directory, onFiles);
}

function resolvable(dir) {
    if (!fs.existsSync(dir)) return false;
    else return true;
}

async function run(dir, func) {
    fs.readdir(dir, async (err, files) => {
        if (err) client.logger.log(err);
        await files.forEach(async file => {
            let n = file;
            file = require(`${dir}/${file}`);
            file.name = dir + '/' + n;
            func(file);
        });
    });
} 