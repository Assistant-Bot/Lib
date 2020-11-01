"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _prefix;
Object.defineProperty(exports, "__esModule", { value: true });
require("../util/Embed");
class Message {
    constructor(m) {
        _prefix.set(this, void 0);
        __classPrivateFieldSet(this, _prefix, '');
        this.type = m.type; // do this properly
        this.activity = m.activity;
        this.application = m.application;
        this.attachments = m.attachments;
        this.author = m.author;
        this.content = m.content;
        this.embeds = m.embeds;
        this.channel = m.channel;
        this.member = m.member;
        this.mentions = m.mentions;
        this.pinned = m.pinned;
        this.reactions = m.reactions;
        this.timestamp = m.timestamp || m.createdTimestamp;
        this.tts = m.tts;
        this.reference = (m.reference || m.messageReference);
        this.webhookID = m.webhookID;
    }
    set prefix(prefix) {
        __classPrivateFieldSet(this, _prefix, prefix);
    }
    get prefix() {
        return __classPrivateFieldGet(this, _prefix);
    }
}
_prefix = new WeakMap();
exports.default = Message;
