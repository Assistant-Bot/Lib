import { Options } from './Classes/Options.js';

class CommandHandler {
    /**
     * 
     * @param {String} dir 
     */
    constructor (dir, options) {
        if (!this.resolvable(dir)) throw 'Could not find directory: ' + dir;
        if (!options instanceof Options) throw 'Invalid options';
    }
}