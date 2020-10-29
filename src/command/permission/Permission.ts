/***
 *                    _     _              _
 *      /\           (_)   | |            | |  
 *     /  \   ___ ___ _ ___| |_ __ _ _ __ | |_ 
 *    / /\ \ / __/ __| / __| __/ _` | '_ \| __|
 *   / ____ \\__ \__ \ \__ \ || (_| | | | | |_ 
 *  /_/    \_\___/___/_|___/\__\__,_|_| |_|\__|
 *
 * Copyright (C) 2020 John Bergman
 * 
 * This is private software, you cannot redistribute and/or modify it in any way
 * unless given explicit permission to do so. If you have not been given explicit
 * permission to view or modify this software you should take the appropriate actions
 * to remove this software from your device immediately.
 */
import type Eris from "eris";

abstract class Permission {
    public name: string;
    public match?: RegExp;
    #id: number;

    public constructor(name: string, id: number, match?: RegExp) {
        this.name = name;
        this.match = match;
        this.#id = id;
    }

    /**
     * Whether or not the user passes this permission.
     * You should change this
     */
    public can(msg: Eris.Message, user: Eris.Member): boolean {
        return true;
    }

    public resolve(msg: Eris.Message, user: Eris.Member): boolean {
        if (this.match) {
            return this.match.test(user.id);
        } else {
            return this.can(msg, user);
        }
    }

    public get id(): number {
        return this.#id;
    }
}
export default Permission;