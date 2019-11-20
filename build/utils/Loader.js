const fs = require('fs');
module.exports = async function (directory, onFiles, strictTypes) {

    if (!directory) throw 'Directory not defined.';
    if (!onFiles) throw 'File handler not defined.';
    if (typeof onFiles !== 'function') throw 'File handler must be a function.';
    if (typeof directory !== 'string') throw 'Directory must be a string.';
    if (!resolvable(directory)) throw 'Directory provided could not be resolved.';

    run(directory, onFiles, strictTypes);
}

function resolvable(dir) {
    if (!fs.existsSync(dir)) return false;
    else return true;
}

function typeCheck(f, types) {
    if (types.ext) {
        let e = f.split('.')[1];
        if (types.ext.includes(e)) return true;
    }
    return false;
}

async function run(dir, func, strictTypes) {
    fs.readdir(dir, async (err, files) => {
        if (err) console.error(err);
        await files.forEach(async file => {
            let n = file;
            if (strictTypes) {
                if (typeCheck(file, strictTypes)) return;
            }
            file = require(`${dir}/${file}`);
            file.name = dir + '/' + n;
            func(file);
        });
    });
}