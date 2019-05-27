class Wrapper {
    /**
     * @param {Array} args 
     */

    constructor (args) {
        return this.wrap(args);
    }

    wrap(args) {
        if (typeof args == 'object') args = args.join(' ');
        let parsed = args.split('"');
        let final = [];

        for (let i = 0; i < parsed.length; i++) {
            let arg = parsed[i];
            if (arg == '') continue;
            arg = arg.trim();
            final.push(arg);
        }

        return final;
    }
}

module.exports = Wrapper;