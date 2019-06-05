class Wrapper {
    /**
     * @param {Array} args 
     */

    constructor (args) {
        return this.wrap(args);
    }

    wrap(args) {
        if (typeof args !== 'object') return args;
        let parsed = args;//args.split('"');
        let final = [];
        let isArg = false;
        let build = '';

        for (let i = 0; i < parsed.length; i++) {
            let arg = parsed[i];
            if (isArg == true) {
                if (arg.search('"') != -1) {
                    build += ' ' + arg.split('"')[0];
                    build = build.trim();
                    final.push(build);
                    build = '';
                    isArg = false;
                    continue;
                } else {
                    build += ' ' + arg;
                    continue;
                }
            }
            if (arg[0] == '"') {
                if (arg[arg.length - 1] == '"') {
                    arg = arg.split('"')[1];
                    arg = arg.trim();
                    final.push(arg);
                    continue;
                }
                isArg = true;
                build = arg.split('"')[1];
                continue;
            }
            if (arg == '') continue;
            arg = arg.trim();
            final.push(arg);
        }

        return final;
    }
}

module.exports = Wrapper;