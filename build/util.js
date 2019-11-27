const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const fs = require('fs');

async function rcmd (str) {
    try {
        let res = await exec(str);
        if (res.stderr) {
            return await res.stderr;
        } else {
            return await res.stdout;
        }
    } catch (error) {
        return error;
    }
}

function getFiles(path) {
    return fs.readdirSync(path).filter(function (file) {
        return !fs.statSync(path + '/' + file).isDirectory();
    });
}

exports.rcmd = rcmd;
exports.getFiles = getFiles;
exports.loader = require('./utils/Loader');
exports.writeto = require('./utils/writeTo.js');
exports.readFile = require('./utils/readFile');