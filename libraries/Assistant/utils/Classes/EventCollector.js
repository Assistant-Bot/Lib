/**
 * 
 *  opts = {
 *      func: (msg) => {
 *          return msg.member.permission.has('administrator');
 *      },
 *      event: 'messageCreate',
 *      time: 1000 // equates to one second.
 *  };
 */
const Events = require('events');
const AdvancedMap = require('./AdvancedMap');

class EventCollector extends Events {
    constructor (emitter, opts=null) {
        super();
        if (opts !== null) this.opts = opts;
        this.emitter = emitter;
    }

    start() {
        this.Collection = new AdvancedMap();
        this.emitter.on(this.opts.event, (...args) => {
            if (this.opts.func(args) === true) {
                this.Collection.push(args);
            }
        });
        const self = this;
        this.stopAt = setTimeout(() => {
            self
        });
    }
}