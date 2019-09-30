const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

module.exports = async (str) => {
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