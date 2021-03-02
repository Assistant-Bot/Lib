/***
 *                    _     _              _
 *      /\           (_)   | |            | |
 *     /  \   ___ ___ _ ___| |_ __ _ _ __ | |_
 *    / /\ \ / __/ __| / __| __/ _` | '_ \| __|
 *   / ____ \\__ \__ \ \__ \ || (_| | | | | |_
 *  /_/    \_\___/___/_|___/\__\__,_|_| |_|\__|
 *
 * Copyright (C) 2020 Bavfalcon9
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 3
 * of the License, or (at your option) any later version.
 */
export async function Sleep(time: number): Promise<void> {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, time);
	})
}

/*
export function unasync<T>(fn: (...args: any[]) => Promise<T>, args: any[] = [], timeout: number = 10000): T {
	const start: number = Date.now();
	const stopAt: number = start + timeout;
	let returnval: T | undefined;
	(async () => {
		returnval = await fn(...args);
		console.log(returnval);
	})()

	while (returnval === undefined) {
		if (stopAt <= Date.now()) {
			throw 'Signature timeout.';
		}
	}

	return returnval as T;
}
*/