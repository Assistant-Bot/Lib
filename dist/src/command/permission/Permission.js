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
var _id;
Object.defineProperty(exports, "__esModule", { value: true });
class Permission {
    constructor(name, id, match) {
        _id.set(this, void 0);
        this.name = name;
        this.match = match;
        __classPrivateFieldSet(this, _id, id);
    }
    resolve(msg, user) {
        if (this.match) {
            return this.match.test(user.id);
        }
        else {
            return this.can(msg, user);
        }
    }
    get id() {
        return __classPrivateFieldGet(this, _id);
    }
}
_id = new WeakMap();
exports.default = Permission;
