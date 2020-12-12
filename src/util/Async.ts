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