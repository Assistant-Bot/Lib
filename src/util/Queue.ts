/***
 *                    _     _              _
 *      /\           (_)   | |            | |
 *     /  \   ___ ___ _ ___| |_ __ _ _ __ | |
 *    / /\ \ / __/ __| / __| __/ _` | '_ \| __|
 *   / ____ \\__ \__ \ \__ \ || (_| | | | | |
 *  /_/    \_\___/___/_|___/\__\__,_|_| |_|\__|
 *
 * Copyright (C) 2020 Bavfalcon9
 *
 * This is private software, you cannot redistribute and/or modify it in any way
 * unless given explicit permission to do so. If you have not been given explicit
 * permission to view or modify this software you should take the appropriate actions
 * to remove this software from your device immediately.
 */
export default abstract class Queue {
	/** The current items in the queue */
	public elements: any[];
	/** The maximum size of the queue */
	#maxSize: number;

	public constructor(size: number = 2048) {
		this.elements = [];
		this.#maxSize = size;
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
		this.executeQueue(element);
		return true;
	}

	protected abstract executeQueue(element: any): any;
}