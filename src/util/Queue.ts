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
class Queue {
    /** The current items in the queue */
    public elements: any[];
    /** The maximum size of the queue */
    #maxSize: number;

    public constructor(size: number = 0) {
        this.elements = [];
        this.#maxSize = 2048;
    }

    /**
     * Size of the queue
     */
    public get size(): number {
        return this.elements.length;
    }

    /**
     * Retrieves the first element of the queue
     */
    public first(): any {
        return this.elements[0];
    }

    /**
     * Dequeue a element of 
     */
    public dequeue(): any {
        return this.elements.shift();
    }

    /**
     * Queue 
     */
    public queue(element: any, replace: boolean = false): boolean {
        if (this.#maxSize && this.elements.length === this.#maxSize) {
            if (replace) {
                this.elements.shift();
            } else {
                return false;
            }
        }
        this.elements.push(element);
        return true;
    }
}