const fs = require('fs');
const betterfs = require('./betterfs.js');
// extend betterfs in future.
class Counter {
    constructor(dir) {
        this.dir = dir;
    }

    getAllLines() {
        let linesTotal = 0;
        let lineBreakUp = {};
        fs.readdir(this.dir, (error, files) => {
            if(error) return console.error(error);

            files.forEach(filename => {
                console.log(`${this.dir}\\${filename}`);
                fs.existsSync(`${this.dir}\\${filename}`)
                let file = fs.readFileSync(`${this.dir}\\${filename}`).toString();
                let lines = file.split("\n;").length;
                linesTotal += lines;
                lineBreakUp[filename] = lines;
            })
        });
        return {
            linesTotal: linesTotal,
            linesBreakUp: lineBreakUp
        };
    }
}

module.exports = Counter;